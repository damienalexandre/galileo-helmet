{
  "targets": [
    {
      "target_name": "i2c",
      "sources": [
        "src/i2c.cc",
        "src/wire.cc"
      ],
      "conditions": [
        ['OS=="linux"', {
          "sources": [
            "src/smbus.c"
          ]
        }]
      ]
    }
  ]
}
