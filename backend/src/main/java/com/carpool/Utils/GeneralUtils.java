package com.carpool.Utils;

import java.util.ArrayList;
import java.util.List;

public class GeneralUtils {
    public static List<String> stringToTokenSplitter(String input, String delimiter) {
        // Initialize a container to store tokens
        List<String> tokens = new ArrayList<>();

        // Handle null or empty input
        if (input == null || input.isEmpty()) {
            return tokens;
        }

        // If delimiter is empty, split input into individual characters
        if (delimiter.isEmpty()) {
            for (char c : input.toCharArray()) {
                tokens.add(String.valueOf(c));
            }
        } else {
            // Split the input string by the specified delimiter
            String[] parts = input.split(delimiter);

            // Add each token to the list
            for (String part : parts) {
                if (!part.trim().isEmpty()) { // Optional: skip empty tokens
                    tokens.add(part.trim());
                }
            }
        }

        return tokens;
    }
}
