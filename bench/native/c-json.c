#include <json-c/json.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
static char *buffers[16];
static uint64_t run(int i) {
  struct json_object *root = json_tokener_parse(buffers[i]);
  if (!root)
    abort();
  struct json_object *rows = json_object_object_get(root, "rows");
  uint64_t sum = 0;
  for (size_t j = 0, n = json_object_array_length(rows); j < n; j++) {
    struct json_object *r = json_object_array_get_idx(rows, j),
                       *name = json_object_object_get(r, "name");
    const char *s = json_object_get_string(name);
    sum += json_object_get_uint64(json_object_object_get(r, "id")) +
           json_object_get_uint64(json_object_object_get(r, "x")) +
           json_object_get_uint64(json_object_object_get(r, "y")) +
           json_object_get_uint64(json_object_object_get(r, "z")) +
           json_object_get_string_len(name) + (unsigned char)s[0];
  }
  json_object_put(root);
  return sum;
}
static double now() {
  struct timespec t;
  clock_gettime(CLOCK_MONOTONIC, &t);
  return t.tv_sec * 1e9 + t.tv_nsec;
}
int main(int argc, char **argv) {
  int iterations = argc > 1 ? atoi(argv[1]) : 20000;
  for (int i = 0; i < 16; i++) {
    char path[100];
    snprintf(path, sizeof(path), ".bench-build/fixtures/json-%d.bin", i);
    FILE *f = fopen(path, "rb");
    if (!f)
      abort();
    fseek(f, 0, SEEK_END);
    long n = ftell(f);
    rewind(f);
    buffers[i] = calloc(n + 1, 1);
    fread(buffers[i], 1, n, f);
    fclose(f);
  }
  uint64_t sum = 0;
  for (int i = 0; i < 2000; i++)
    sum += run(i % 16);
  printf("{\"C json-c DOM\":{\"samples\":[");
  for (int s = 0; s < 9; s++) {
    double start = now();
    for (int i = 0; i < iterations; i++) {
      __asm__ volatile("" ::: "memory");
      sum += run(i % 16);
    }
    double ns = (now() - start) / iterations;
    printf("%s%.2f", s ? "," : "", ns);
  }
  printf("],\"checksum\":%llu}}\n", (unsigned long long)sum);
}
