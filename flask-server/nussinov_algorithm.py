
# minimum loop length to allow biologically valid pairings
##Theres a slide on thi in lecture 10 but not sure if you guys want to do this
MIN_LOOP_LENGTH = 4

def stack_based_backtrace(dp, sequence, pairs):
    """Perform backtrace to determine RNA secondary structure."""
    n = len(sequence)
    structure = ["." for _ in range(n)]  # Initialize secondary structure as unpaired
    stack = [(0, n - 1)]  # Start from the top-right corner of the DP table
    visited_cells = []  # List to track visited cells for debugging or analysis

    while stack:
        i, j = stack.pop()
        if i >= j:  # Base case: No valid pairs possible
            continue
        visited_cells.append((i, j)) 

        if dp[i + 1][j] == dp[i][j]: 
            stack.append((i + 1, j))
        elif dp[i][j - 1] == dp[i][j]: 
            stack.append((i, j - 1))
        elif dp[i + 1][j - 1] + 1 == dp[i][j] and pairs.get(sequence[i]) == sequence[j]:  # Case 3: Pair (i, j)
            structure[i], structure[j] = "(", ")"  # Record the base pair
            stack.append((i + 1, j - 1))
        else: 
            for k in range(i + 1, j):
                if dp[i][k] + dp[k + 1][j] == dp[i][j]:
                    stack.append((k + 1, j))
                    stack.append((i, k))
                    break 

    return structure, visited_cells

def nussinov_algorithm(sequence):
    n = len(sequence)
    dp = [[0 for _ in range(n)] for _ in range(n)]  # fill DP table with zeros
    pairs = {'A': 'U', 'U': 'A', 'C': 'G', 'G': 'C'}  # base pairing rules

    # Fill DP table 
    for length in range(1, n):  # Iterate over possible subsequence lengths
        for i in range(n - length):  # Iterate over start indices
            j = i + length  # Calculate end index
            unpaired_i = dp[i + 1][j] 
            unpaired_j = dp[i][j - 1] 
            pair_ij = dp[i + 1][j - 1] + (1 if pairs.get(sequence[i]) == sequence[j] and j - i > MIN_LOOP_LENGTH else 0)
            bifurcation = max((dp[i][k] + dp[k + 1][j] for k in range(i, j)), default=0)
            dp[i][j] = max(unpaired_i, unpaired_j, pair_ij, bifurcation)

    # backtrace to determine optimal structure
    structure, visited_cells = stack_based_backtrace(dp, sequence, pairs)

    return dp, "".join(structure), visited_cells

# #test code
# # sequence = "AUGCUAGCUAGCUAGCUAGC"
# # dp_table, structure = nussinov_algorithm(sequence)
# # print("DP Table:")
# # for row in dp_table:
# #     print(row)
# # print("\nOptimal Structure:", structure)