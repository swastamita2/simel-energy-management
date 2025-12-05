import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, calculatePercentage } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats Indonesian Rupiah correctly', () => {
      const result1 = formatCurrency(1000000);
      const result2 = formatCurrency(2500);
      expect(result1).toContain('Rp');
      expect(result1).toContain('1.000.000');
      expect(result2).toContain('Rp');
      expect(result2).toContain('2.500');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with default decimal', () => {
      expect(formatPercentage(87.5)).toBe('87.5%');
    });

    it('formats percentage with custom decimals', () => {
      expect(formatPercentage(87.555, 2)).toBe('87.56%');
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 200)).toBe(12.5);
    });

    it('handles zero total', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });
});
