import { assert, Bytes, Field, Struct, ZkProgram, Provable, Bool } from "o1js";

class Bytes256 extends Bytes(256) {}
class Bytes32 extends Bytes(32) {}

export class SubarrayInput extends Struct({
  needle: Bytes32,
  haystack: Bytes256,
  offset: Field,
}) {}

function assertEqualIf(enabled: Bool, x: Field, y: Field) {
  // If the condition is enabled, assert that x and y are equal
  // If the condition is disabled, assert that x is equal to itself (which is always true)
  const xOrY = Provable.if(enabled, y, x);
  x.assertEquals(xOrY);
}

export const ZkSubarray = ZkProgram({
  name: "substring",
  publicInput: SubarrayInput,

  methods: {
    checkSubarray: {
      privateInputs: [],
      async method(inp: SubarrayInput) {
        for (let i = 0; i < 256; i += 1) {
          assertEqualIf(
            inp.offset
              .greaterThanOrEqual(i)
              .and(inp.offset.add(32).lessThan(i)),
            inp.haystack.bytes[i].value,
            inp.needle.bytes[i - inp.offset].value,
          );
        }
      },
    },
  },
});
