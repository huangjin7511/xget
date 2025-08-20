import { describe, expect, it } from 'vitest';
import { transformPath } from '../src/config/platforms.js';

describe('Kaggle API path transformation', () => {
  it('should transform dataset download URLs correctly', () => {
    const path = '/kaggle/datasets/download/zillow/zecon';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/datasets/download/zillow/zecon');
  });

  it('should transform dataset list URLs correctly', () => {
    const path = '/kaggle/datasets/list';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/datasets/list');
  });

  it('should transform competition data download URLs correctly', () => {
    const path = '/kaggle/competitions/data/download/titanic';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/competitions/data/download/titanic');
  });

  it('should transform competition list URLs correctly', () => {
    const path = '/kaggle/competitions/list';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/competitions/list');
  });

  it('should transform model list URLs correctly', () => {
    const path = '/kaggle/models/list';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/models/list');
  });

  it('should transform kernel list URLs correctly', () => {
    const path = '/kaggle/kernels/list';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/kernels/list');
  });

  it('should handle URLs that already have API prefix', () => {
    const path = '/kaggle/api/v1/datasets/download/owner/dataset';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/datasets/download/owner/dataset');
  });

  it('should handle search endpoints with query parameters', () => {
    const path = '/kaggle/datasets/list?search=housing&sortBy=votes';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/datasets/list?search=housing&sortBy=votes');
  });

  it('should handle dataset metadata URLs', () => {
    const path = '/kaggle/datasets/metadata/owner/dataset-slug';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/datasets/metadata/owner/dataset-slug');
  });

  it('should handle competition submissions', () => {
    const path = '/kaggle/competitions/submissions/submit';
    const result = transformPath(path, 'kaggle');
    expect(result).toBe('/api/v1/competitions/submissions/submit');
  });
});
