import assert from "node:assert/strict";
import { test } from "node:test";
import {
  rentalDayCount,
  rentalRangesOverlap,
  validateRentalDates,
} from "../src/services/rental.rules.js";

test("inclusive rental ranges accept adjacent dates and reject shared-date overlap", () => {
  const first = { startDate: "2030-01-01", endDate: "2030-01-03" };
  const adjacent = { startDate: "2030-01-04", endDate: "2030-01-05" };
  const sharedDate = { startDate: "2030-01-03", endDate: "2030-01-04" };

  assert.equal(rentalRangesOverlap(first, adjacent), false);
  assert.equal(rentalRangesOverlap(first, sharedDate), true);
});

test("inclusive same-day rental is one day and a reversed range is zero/invalid", () => {
  assert.equal(rentalDayCount("2030-01-01", "2030-01-01"), 1);
  assert.equal(rentalDayCount("2030-01-02", "2030-01-01"), null);
});

test("rental date validation rejects reversed ranges", () => {
  assert.match(validateRentalDates({
    startDate: "2030-01-02",
    endDate: "2030-01-01",
    today: "2030-01-01",
  }), /on or after/);
});

test("rental date validation rejects rentals longer than 30 inclusive days", () => {
  assert.match(validateRentalDates({
    startDate: "2030-01-01",
    endDate: "2030-01-31",
    today: "2030-01-01",
  }), /cannot exceed 30 days/);
});

test("rental date validation rejects a start date before today", () => {
  assert.match(validateRentalDates({
    startDate: "2030-01-01",
    endDate: "2030-01-01",
    today: "2030-01-02",
  }), /cannot be in the past/);
});
