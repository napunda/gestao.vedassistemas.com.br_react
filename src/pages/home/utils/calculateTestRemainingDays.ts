export const calculateTestRemainingDays = (
  startTestPeriodAt: Date,
  testingPeriodLimitDays: number
) => {
  if (startTestPeriodAt) {
    const today = new Date();
    const startDate = new Date(startTestPeriodAt);
    const totalTestDays = testingPeriodLimitDays;

    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const remainingDays = totalTestDays - diffDays;

    if (remainingDays < 0) {
      return 0;
    }

    return remainingDays;
  }
  return null;
};
