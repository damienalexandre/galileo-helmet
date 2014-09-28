#include <node.h>
#include "wire.h"

using namespace v8;

namespace i2c {

void InitializeAll(Handle<Object> exports) {
  Wire::Initialize(exports);
}

} // namespace i2c

NODE_MODULE(i2c, i2c::InitializeAll);
