#ifndef WIRE_H
#define WIRE_H

#include <node.h>
#include <v8.h>

namespace i2c {

class Wire : public node::ObjectWrap {
 public:
  static void Initialize(v8::Handle<v8::Object> exports);

 private:
  Wire(const char* device, int address);
  ~Wire();

  // Wrapped methods
  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> Read(const v8::Arguments& args);
  static v8::Handle<v8::Value> Write(const v8::Arguments& args);
  static v8::Persistent<v8::Function> constructor;

  int file_;
};

} // namespace i2c

#endif
