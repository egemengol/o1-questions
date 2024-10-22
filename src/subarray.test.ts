import { Bytes, Field } from "o1js";
import { SubarrayInput, ZkSubarray } from "./subarray";

describe("zk substring", () => {
  beforeAll(async () => {
    await ZkSubarray.compile();
  });

  it("proves substring", async () => {
    const haystack = Array.from({ length: 256 }, (_, i) => i);
    const offset = 4;
    const needle = haystack.slice(offset, offset + 32);

    const inp = new SubarrayInput({
      haystack: Bytes.from(Uint8Array.from(haystack)),
      needle: Bytes.from(Uint8Array.from(needle)),
      offset: Field(offset),
    });

    await ZkSubarray.checkSubarray(inp);
  });
});
