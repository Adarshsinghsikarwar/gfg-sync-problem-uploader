# Maximum Sub Array

**Difficulty:** Medium
**Topics:** Arrays, Divide and Conquer, Data Structures, Algorithms, Amazon, Microsoft, Intuit
**Link:** [GFG Problem](https://www.geeksforgeeks.org/problems/maximum-sub-array5443/1)

## Problem Statement

<p><span style="font-size: 14pt;">Given an array of integers <strong>arr[]</strong>, find the contiguous subarray with the <strong>maximum sum </strong>that contains only non-negative numbers. If multiple subarrays have the same maximum sum return the one with <strong>longest length.</strong> If there is still a tie, return the subarray with the <strong>smallest starting index</strong>. If the array contains only <strong>negative</strong> numbers, return <strong>-1</strong>.</span></p>
<p><span style="font-size: 14pt;"><strong>Note: </strong>A subarray is a contiguous non-empty sequence of elements within an array.</span></p>
<p><span style="font-size: 14pt;"><strong>Examples:</strong></span></p>
<pre><span style="font-size: 14pt;"><strong>Input: </strong>arr[] = [1, 2, 3]
<strong>Output:</strong> [1, 2, 3]
<strong>Explanation:</strong> In the given array, every element is non-negative, so the entire array [1, 2, 3] is the valid subarray with the maximum sum.
</span></pre>
<pre><span style="font-size: 14pt;"><strong>Input: </strong>arr[] = [-1, 2]
<strong>Output:</strong> [2]
<strong>Explanation:</strong> The only valid non-negative subarray is [2], so the output is [2].<br /></span></pre>
<pre><span style="font-size: 14pt;"><strong>Input: </strong>arr[] = [1, 2, 5, -7, 2, 6]
<strong>Output:</strong> [1, 2, 5]
<strong>Explanation:</strong> The valid non-negative subarrays are [1, 2, 5] and [2, 6]. Both have the same sum of 8, but [1, 2, 5] starts earlier and also longest one so it is the preferred subarray.</span></pre>
<p><span style="font-size: 14pt;"><strong>Constraints:</strong><br />1 &le; arr.size() &le; 10<sup>6</sup><br />-10<sup>5&nbsp;</sup>&le; arr[i] &le; 10<sup>5</sup></span></p>

## Examples

_No examples captured — add manually._

## Constraints

—

## Solution

```java
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
```

## Approach / Notes

O(n) time, O(1) space - tracking positive subarray maximum sum with longest length and smallest starting index.

---
_Synced on 2026-06-25_
