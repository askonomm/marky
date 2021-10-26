import { marky } from "./marky.ts";
import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";

// Test bold text parsing and conversion
Deno.test("Test bold text parsing and conversion", () => {
  const testString = `Hello **Mr. Bond**.`;
  const expectedResult = `<p>Hello <strong>Mr. Bond</strong>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test italic text parsing and conversion
Deno.test("Test italic text parsing and conversion", () => {
  const testString = `Hello _Mr. Bond_.`;
  const expectedResult = `<p>Hello <em>Mr. Bond</em>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test inline code text parsing and conversion
Deno.test("Test inline code text parsing and conversion", () => {
  const testString = `Hello \`Mr. Bond\`.`;
  const expectedResult = `<p>Hello <code>Mr. Bond</code>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test strikethrough text parsing and conversion
Deno.test("Test strikethrough text parsing and conversion", () => {
  const testString = `Hello ~~Mr. Bond\~~.`;
  const expectedResult = `<p>Hello <del>Mr. Bond</del>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test block parsing and conversion
Deno.test("Test block parsing and conversion", () => {
  const testString = `
# The Villain

Hello Mr. Bond.

I've been _expecting_ you.

## The Bond

Why, me too!
    `;
  const expectedResult =
    `<h1>The Villain</h1><p>Hello Mr. Bond.</p><p>I've been <em>expecting</em> you.</p><h2>The Bond</h2><p>Why, me too!</p>`;
  assertEquals(expectedResult, marky(testString));
});
