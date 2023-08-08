package com.ygd.grab_the_beat.util;

import java.security.SecureRandom;
import java.util.Date;

public class RandomCodeUtil {

    final static private char[] LETTERS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };
    final static private int LENGTH = 6;

    public static String makeRandomCode() {
        StringBuilder sb = new StringBuilder();
        SecureRandom sr = new SecureRandom();
        sr.setSeed(new Date().getTime());

        for (int i = 0; i < LENGTH; i++) {
            sb.append(LETTERS[sr.nextInt(LETTERS.length)]);
        }

        return sb.toString();
    }

}