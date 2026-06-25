class Solution {
    public ArrayList<Integer> findSubarray(int arr[]) {
        int n = arr.length;

        long currSum = 0;
        long bestSum = -1;

        int currStart = 0;
        int bestStart = -1;
        int bestEnd = -1;

        boolean foundNonNegative = false;

        for (int i = 0; i < n; i++) {

            if (arr[i] >= 0) {
                foundNonNegative = true;
                currSum += arr[i];
            } else {

                if (currSum > bestSum) {
                    bestSum = currSum;
                    bestStart = currStart;
                    bestEnd = i - 1;
                } else if (currSum == bestSum) {

                    int currLength = i - currStart;
                    int bestLength = bestEnd - bestStart + 1;

                    if (currLength > bestLength) {
                        bestStart = currStart;
                        bestEnd = i - 1;
                    }
                }

                currSum = 0;
                currStart = i + 1;
            }
        }

        // Last segment check
        if (currSum > bestSum) {
            bestSum = currSum;
            bestStart = currStart;
            bestEnd = n - 1;
        } else if (currSum == bestSum) {

            int currLength = n - currStart;
            int bestLength = bestEnd - bestStart + 1;

            if (currLength > bestLength) {
                bestStart = currStart;
                bestEnd = n - 1;
            }
        }

        ArrayList<Integer> ans = new ArrayList<>();

        if (!foundNonNegative) {
            ans.add(-1);
            return ans;
        }

        for (int i = bestStart; i <= bestEnd; i++) {
            ans.add(arr[i]);
        }

        return ans;
    }
}