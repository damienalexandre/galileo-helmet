#include <stdlib.h>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

void debug(const char *format, ...) {
  char prefix[] = "\x1b[33m[native]\x1b[0m ";
  size_t prefix_length = strlen(prefix);
  size_t format_length = strlen(format);
  char* prefixed_format = (char*) malloc(prefix_length + format_length + 2); // includes new line & terminating null
  memcpy(prefixed_format, prefix, prefix_length);
  memcpy(prefixed_format + prefix_length, format, format_length);
  strcpy(prefixed_format + prefix_length + format_length, "\n");

  va_list args;
  va_start(args, format);
  vprintf(prefixed_format, args);
  va_end(args);

  free(prefixed_format);
}