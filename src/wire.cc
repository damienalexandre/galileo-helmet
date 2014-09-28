#include <node.h>
#include <v8.h>
#include <string>
#include <string.h>
#include "wire.h"
#include "debug.h"

#ifdef __linux__
# include <unistd.h>
# include <sys/ioctl.h>
# include <errno.h>
# include "i2c-dev.h"
extern "C" {
# include "smbus.h"
}
#endif

using namespace v8;

namespace i2c {

Persistent<Function> Wire::constructor;

Handle<Value> ThrowTypeError(std::string message) {
    return ThrowException(Exception::TypeError(String::New(message.c_str())));
}

Wire::Wire(const char* device, int address) {
#ifdef __linux__
  file_ = open(device, O_RDWR);
  if (file_ < 0) {
    ThrowException(Exception::Error(String::New(strerror(errno))));
    return;
  }
#else
  file_ = 0;
  debug("open(%s, O_RDWR) -> %d", device, file_);
#endif

#ifdef __linux__
  if (ioctl(file_, I2C_SLAVE, address) < 0) {
    ThrowException(Exception::Error(String::New(strerror(errno))));
    return;
  }
#else
  debug("ioctl(%d, I2C_SLAVE, 0x%x)", file_, address);
#endif
}

Wire::~Wire() {
#ifdef __linux__
  if (close(file_) < 0) {
    ThrowException(Exception::Error(String::New(strerror(errno))));
    return;
  }
#else
  debug("close(%d)", file_);
#endif
}

Handle<Value> Wire::New(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 2) {
    ThrowTypeError("Wrong number of arguments");
    return scope.Close(Undefined());
  }

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    if (!args[0]->IsString() || !args[1]->IsInt32()) {
      ThrowTypeError("Wrong arguments");
      return scope.Close(Undefined());
    }
    String::Utf8Value device(args[0]);
    int address = args[1]->Int32Value();
    Wire* wire = new Wire(*device, address);
    wire->Wrap(args.This());
    return args.This();
  } else {
    // Invoked as plain function `Wire(...)`, turn into construct call.
    const int argc = 2;
    Local<Value> argv[argc] = { args[0], args[1] };
    return scope.Close(constructor->NewInstance(argc, argv));
  }
}

typedef struct {
  int fd;
  int address;
  int result;
  v8::Persistent<v8::Function> callback;
} i2c_read_t;

void read(i2c_read_t* op) {
#ifdef __linux__
  int value = i2c_smbus_read_byte_data(op->fd, op->address);
#else
  int value = 42;
  debug("i2c_smbus_read_byte_data(%d, 0x%x) -> 0x%x", op->fd, op->address, value);
#endif
  op->result = value;
}

void async_read(uv_work_t* req) {
  i2c_read_t* op = (i2c_read_t *) req->data;
  read(op);
}

void after_read(uv_work_t* req, int status) {
  HandleScope scope;
  Handle<Value> argv[2];

  i2c_read_t* op = (i2c_read_t *) req->data;

  if (op->result < 0) {
    argv[0] = Exception::Error(String::New("Can't read data from device"));
    argv[1] = Undefined();
  }
  else {
    argv[0] = Null();
    argv[1] = Number::New(op->result);
  }

  op->callback->Call(Context::GetCurrent()->Global(), 2, argv);
  op->callback.Dispose();

  delete op;
  delete req;
}

Handle<Value> Wire::Read(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 1 || !args[0]->IsInt32())
    return scope.Close(ThrowTypeError("Wrong arguments"));

  i2c_read_t* op = new i2c_read_t;

  Wire* wire = ObjectWrap::Unwrap<Wire>(args.This());
  op->fd = wire->file_;
  op->address = args[0]->Int32Value();

  if (args.Length() == 2 && args[1]->IsFunction()) {
    op->callback = Persistent<Function>::New(Local<Function>::Cast(args[1]));

    uv_work_t* req = new uv_work_t;
    req->data = op;

    uv_queue_work(uv_default_loop(), req, async_read, after_read);

    return scope.Close(Undefined());
  }
  else {
    read(op);

    if (op->result < 0)
      ThrowException(Exception::Error(String::New("Can't read data from device")));

    delete op;
    return scope.Close(Number::New(op->result));
  }
}

typedef struct {
  int fd;
  int address;
  int value;
  int result;
  v8::Persistent<v8::Function> callback;
} i2c_write_t;

void write(i2c_write_t* op) {
#ifdef __linux__
  int err = i2c_smbus_write_byte_data(op->fd, op->address, op->value);
#else
  int err = 0;
  debug("i2c_smbus_write_byte_data(%d, 0x%x, 0x%x) -> %d", op->fd, op->address, op->value, err);
#endif
  op->result = err;
}

void async_write(uv_work_t* req) {
  i2c_write_t* op = (i2c_write_t *) req->data;
  write(op);
}

void after_write(uv_work_t* req, int status) {
  HandleScope scope;

  Handle<Value> argv[1];

  i2c_write_t* op = (i2c_write_t *) req->data;
  if (op->result < 0)
    argv[0] = Exception::Error(String::New("Can't write data to device"));
  else
    argv[0] = Null();

  op->callback->Call(Context::GetCurrent()->Global(), 1, argv);
  op->callback.Dispose();

  delete op;
  delete req;
}

Handle<Value> Wire::Write(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 2) {
    ThrowTypeError("Wrong number of arguments");
    return scope.Close(Undefined());
  }
  if (!args[0]->IsInt32() || !args[1]->IsInt32()) {
    ThrowTypeError("Wrong arguments");
    return scope.Close(Undefined());
  }

  i2c_write_t* op = new i2c_write_t;

  Wire* wire = ObjectWrap::Unwrap<Wire>(args.This());
  op->fd = wire->file_;
  op->value = args[1]->Int32Value();
  op->address = args[0]->Int32Value();

  if (args.Length() == 3 && args[2]->IsFunction()) {
    op->callback = Persistent<Function>::New(Local<Function>::Cast(args[2]));

    uv_work_t* req = new uv_work_t;
    req->data = op;

    uv_queue_work(uv_default_loop(), req, async_write, after_write);

    return scope.Close(Undefined());
  }
  else {
    write(op);

    if (op->result < 0)
      ThrowException(Exception::Error(String::New("Can't write data to device")));

    delete op;
    return scope.Close(Undefined());
  }
}


void Wire::Initialize(Handle<Object> exports) {
  // Prepare constructor template
  Local<FunctionTemplate> constructor_template = FunctionTemplate::New(New);
  constructor_template->SetClassName(String::NewSymbol("Wire"));
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);
  // Prototype
  NODE_SET_PROTOTYPE_METHOD(constructor_template, "read", Read);
  NODE_SET_PROTOTYPE_METHOD(constructor_template, "write", Write);

  constructor = Persistent<Function>::New(constructor_template->GetFunction());

  exports->Set(String::NewSymbol("Wire"), constructor);
}

} // namespace i2c
