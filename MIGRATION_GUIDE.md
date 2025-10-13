# Migration Guide: Improving Code Quality Score from 7.5/10 to 10/10

## Overview

This document provides a comprehensive, step-by-step guide to improve the codebase quality score from **7.5/10 to 10/10**. The migration is divided into phases based on priority and impact.

**Current State:** 7.5/10
**Target State:** 10/10
**Estimated Effort:** 40-60 hours
**Risk Level:** Low-Medium

---

## Table of Contents

1. [Phase 1: Critical Fixes (Priority: CRITICAL)](#phase-1-critical-fixes)
   - [1.1 Testing Infrastructure Setup](#11-testing-infrastructure-setup)
   - [1.2 Accessibility Fixes](#12-accessibility-fixes)
2. [Phase 2: High Priority Improvements](#phase-2-high-priority-improvements)
   - [2.1 Dependency Inversion Implementation](#21-dependency-inversion-implementation)
   - [2.2 Error Handling Strategy](#22-error-handling-strategy)
   - [2.3 API Client Standardization](#23-api-client-standardization)
3. [Phase 3: Quality Enhancements](#phase-3-quality-enhancements)
   - [3.1 Interface Segregation](#31-interface-segregation)
   - [3.2 Documentation & Type Safety](#32-documentation--type-safety)
4. [Verification & Validation](#verification--validation)
5. [Rollback Plan](#rollback-plan)

---

## Phase 1: Critical Fixes

**Timeline:** Week 1-2
**Impact:** High
**Risk:** Low

### 1.1 Testing Infrastructure Setup

**Current Score:** 0/10 → **Target Score:** 10/10

#### Step 1.1.1: Install Testing Dependencies

```bash
# Install Vitest and React Testing Library
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install coverage tools
pnpm add -D @vitest/coverage-v8
```

#### Step 1.1.2: Create Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/app': path.resolve(__dirname, './src/app'),
    }
  }
});
```

#### Step 1.1.3: Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

#### Step 1.1.4: Update package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

#### Step 1.1.5: Create Test Files for Core Modules

**Create `src/core/validators/registry/emailValidator.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { emailValidator } from './emailValidator';
import type { FormField } from '../../../types/form.types';

describe('emailValidator', () => {
  const mockEmailField: FormField = {
    id: '1',
    type: 'email',
    title: 'Email',
    required: true,
    field_key: 'email',
    hidden: false,
    unique: null,
    options: [],
    page_num: 1,
    property: {},
    conditions: {},
    team_field: false,
    description: null,
    placeholder: 'Enter email'
  };

  it('should validate correct email addresses', () => {
    const result = emailValidator(mockEmailField, 'test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject invalid email addresses', () => {
    const result = emailValidator(mockEmailField, 'invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('should pass validation for empty non-email fields', () => {
    const nonEmailField = { ...mockEmailField, type: 'text' };
    const result = emailValidator(nonEmailField, '');
    expect(result.isValid).toBe(true);
  });

  it('should pass validation for empty email value', () => {
    const result = emailValidator(mockEmailField, '');
    expect(result.isValid).toBe(true);
  });

  it('should handle whitespace-only values', () => {
    const result = emailValidator(mockEmailField, '   ');
    expect(result.isValid).toBe(true);
  });
});
```

**Create `src/core/validators/registry/requiredValidator.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { requiredValidator } from './requiredValidator';
import type { FormField } from '../../../types/form.types';

describe('requiredValidator', () => {
  const mockRequiredField: FormField = {
    id: '1',
    type: 'text',
    title: 'Name',
    required: true,
    field_key: 'name',
    hidden: false,
    unique: null,
    options: [],
    page_num: 1,
    property: {},
    conditions: {},
    team_field: false,
    description: null,
    placeholder: 'Enter name'
  };

  it('should validate required fields with values', () => {
    const result = requiredValidator(mockRequiredField, 'John Doe');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty required fields', () => {
    const result = requiredValidator(mockRequiredField, '');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('This field is required');
  });

  it('should reject whitespace-only values', () => {
    const result = requiredValidator(mockRequiredField, '   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('This field is required');
  });

  it('should pass validation for non-required fields', () => {
    const optionalField = { ...mockRequiredField, required: false };
    const result = requiredValidator(optionalField, '');
    expect(result.isValid).toBe(true);
  });
});
```

**Create `src/core/operators/registry/operatorRegistry.test.ts`:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { operatorRegistry } from './operatorRegistry';

describe('operatorRegistry', () => {
  beforeEach(() => {
    // Clear any existing operators
    const registry = operatorRegistry as any;
    registry.operators?.clear();
  });

  it('should register and evaluate equality operator', () => {
    operatorRegistry.register('=', (a, b) => a === b);

    const result = operatorRegistry.evaluate('=', 'test', 'test');
    expect(result).toBe(true);
  });

  it('should register and evaluate inequality operator', () => {
    operatorRegistry.register('!=', (a, b) => a !== b);

    const result = operatorRegistry.evaluate('!=', 'test', 'other');
    expect(result).toBe(true);
  });

  it('should return true for unknown operators with warning', () => {
    const result = operatorRegistry.evaluate('unknown', 'a', 'b');
    expect(result).toBe(true);
  });

  it('should check if operator exists', () => {
    operatorRegistry.register('exists', (a, b) => a === b);

    expect(operatorRegistry.has('exists')).toBe(true);
    expect(operatorRegistry.has('notexists')).toBe(false);
  });
});
```

**Create `src/components/ui/Button/Button.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click Me</Button>);
    await user.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Step 1.1.6: Run Tests and Verify

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run with UI
pnpm test:ui
```

**Success Criteria:**
- ✅ All tests pass
- ✅ Coverage meets 80% threshold
- ✅ CI/CD integration ready

---

### 1.2 Accessibility Fixes

**Current Score:** 5/10 → **Target Score:** 10/10

#### Step 1.2.1: Fix Button Component

**File:** `src/components/ui/Button/Button.tsx`

**Before:**
```typescript
import styles from "./Button.module.css";

export const Button = ({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) => {
    return (
        <div className={styles.buttonContainer} onClick={onClick}>
            {children}
        </div>
    );
};
```

**After:**
```typescript
import styles from "./Button.module.css";

export interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}

export const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    ariaLabel,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`${styles.buttonContainer} ${className || ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};
```

#### Step 1.2.2: Update Button CSS

**File:** `src/components/ui/Button/Button.module.css`

Add the following to ensure button styling is consistent:

```css
.buttonContainer {
    /* Existing styles */
    cursor: pointer;
    border: none;
    background: inherit;
    font: inherit;
}

.buttonContainer:hover {
    /* Hover styles */
}

.buttonContainer:focus {
    outline: 2px solid var(--focus-color, #0066cc);
    outline-offset: 2px;
}

.buttonContainer:focus:not(:focus-visible) {
    outline: none;
}

.buttonContainer:focus-visible {
    outline: 2px solid var(--focus-color, #0066cc);
    outline-offset: 2px;
}

.buttonContainer:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

#### Step 1.2.3: Update All Button Usages

Search for all Button usages and update them:

```bash
# Find all Button usages
grep -r "<Button" src/ --include="*.tsx"
```

Update usages to use semantic HTML:

```typescript
// Before
<Button onClick={handleSubmit}>Submit</Button>

// After
<Button type="submit" onClick={handleSubmit} ariaLabel="Submit form">
  Submit
</Button>
```

#### Step 1.2.4: Add Accessibility Tests

**Create `src/components/ui/Button/Button.a11y.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Accessibility', () => {
  it('should be keyboard accessible', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  it('should have proper ARIA label', () => {
    render(<Button onClick={() => {}} ariaLabel="Custom label">Click</Button>);
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Click</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have button role', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

**Success Criteria:**
- ✅ Button uses semantic `<button>` element
- ✅ Keyboard navigation works (Tab, Enter, Space)
- ✅ Screen readers properly announce the button
- ✅ Focus styles are visible
- ✅ All accessibility tests pass

---

## Phase 2: High Priority Improvements

**Timeline:** Week 3-4
**Impact:** High
**Risk:** Medium

### 2.1 Dependency Inversion Implementation

**Current Score:** 6.5/10 → **Target Score:** 10/10

#### Step 2.1.1: Create API Abstraction Layer

**Create `src/lib/api/interfaces/IApiClient.ts`:**

```typescript
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export interface IApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number>;
}
```

#### Step 2.1.2: Create Axios Adapter

**Create `src/lib/api/adapters/AxiosApiClient.ts`:**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import type { IApiClient, ApiResponse, ApiError, RequestConfig } from '../interfaces/IApiClient';

export class AxiosApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.handleError(error))
    );
  }

  private handleError(error: AxiosError): ApiError {
    return {
      message: error.message,
      status: error.response?.status || 500,
      data: error.response?.data,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
}
```

#### Step 2.1.3: Create API Client Factory

**Create `src/lib/api/factory/apiClientFactory.ts`:**

```typescript
import { env } from '@/config';
import { AxiosApiClient } from '../adapters/AxiosApiClient';
import type { IApiClient } from '../interfaces/IApiClient';

class ApiClientFactory {
  private static instance: IApiClient;

  static getInstance(): IApiClient {
    if (!ApiClientFactory.instance) {
      ApiClientFactory.instance = new AxiosApiClient(env.apiBaseUrl);
    }
    return ApiClientFactory.instance;
  }

  // For testing purposes
  static setInstance(client: IApiClient): void {
    ApiClientFactory.instance = client;
  }
}

export const apiClient = ApiClientFactory.getInstance();
```

#### Step 2.1.4: Create Repository Interface

**Create `src/features/form/repositories/IFormRepository.ts`:**

```typescript
import type { SubmitFormResponse } from '../api/formSubmissionApi';

export interface IFormRepository {
  submitForm(
    eventId: string,
    formData: Record<string, string>,
    logId?: string | null
  ): Promise<SubmitFormResponse>;

  updateFormLog(
    eventId: string,
    formData: Record<string, string>,
    logId: string
  ): Promise<void>;
}
```

#### Step 2.1.5: Implement Repository

**Create `src/features/form/repositories/FormRepository.ts`:**

```typescript
import type { IApiClient } from '@/lib/api/interfaces/IApiClient';
import type { IFormRepository } from './IFormRepository';
import type { SubmitFormResponse } from '../api/formSubmissionApi';
import { prepareSubmitFormData } from '../utils';

export class FormRepository implements IFormRepository {
  private apiClient: IApiClient;
  private baseUrl: string;

  constructor(apiClient: IApiClient, baseUrl: string = 'https://api.makemypass.com/makemypass/public-form') {
    this.apiClient = apiClient;
    this.baseUrl = baseUrl;
  }

  async submitForm(
    eventId: string,
    formData: Record<string, string>,
    logId?: string | null
  ): Promise<SubmitFormResponse> {
    const submitData = prepareSubmitFormData(formData, logId);

    const response = await this.apiClient.post<{ response: SubmitFormResponse }>(
      `${this.baseUrl}/${eventId}/submit/`,
      submitData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data.response;
  }

  async updateFormLog(
    eventId: string,
    formData: Record<string, string>,
    logId: string
  ): Promise<void> {
    await this.apiClient.post(
      `${this.baseUrl}/${eventId}/form-log/${logId}/`,
      formData
    );
  }
}
```

#### Step 2.1.6: Update Hook to Use Repository

**Update `src/features/form/hooks/useFormSubmit.ts`:**

```typescript
import { useMemo } from 'react';
import { apiClient } from '@/lib/api/factory/apiClientFactory';
import { FormRepository } from '../repositories/FormRepository';
import { useEventDataContext } from '../contexts/eventDataContext';
import { transformFormData } from '../utils';
import type { SubmitFormResponse } from '../api/formSubmissionApi';

export const useFormSubmit = () => {
  const eventData = useEventDataContext();

  // Create repository instance (could also be injected via context)
  const repository = useMemo(() => new FormRepository(apiClient), []);

  const submit = async (
    formData: Record<string, string>,
    logId: string | null | undefined
  ): Promise<SubmitFormResponse> => {
    // Pre-Submission: Update Form Log
    if (eventData.id && eventData.tickets?.length > 0 && logId) {
      await repository.updateFormLog(eventData.id, formData, logId);
    }

    const transformedData = transformFormData(formData);
    return await repository.submitForm(eventData.id, transformedData, logId);
  };

  return { submit };
};
```

#### Step 2.1.7: Update Barrel Exports

**Update `src/lib/api/index.ts`:**

```typescript
export * from './interfaces/IApiClient';
export * from './adapters/AxiosApiClient';
export * from './factory/apiClientFactory';
```

**Success Criteria:**
- ✅ API client abstracted behind interface
- ✅ Easy to swap implementations (e.g., fetch API, mock client)
- ✅ Business logic doesn't depend on specific HTTP library
- ✅ Testable with mock implementations

---

### 2.2 Error Handling Strategy

**Current Score:** 6/10 → **Target Score:** 10/10

#### Step 2.2.1: Create Error Classes

**Create `src/lib/errors/AppError.ts`:**

```typescript
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly data?: unknown;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, data?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, data);
    this.name = 'ValidationError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number, data?: unknown) {
    super(message, ErrorCode.API_ERROR, statusCode, data);
    this.name = 'ApiError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, ErrorCode.NETWORK_ERROR);
    this.name = 'NetworkError';
  }
}
```

#### Step 2.2.2: Create Error Logger Service

**Create `src/lib/errors/ErrorLogger.ts`:**

```typescript
import type { AppError } from './AppError';

export interface IErrorLogger {
  log(error: Error | AppError): void;
  logToService(error: Error | AppError): Promise<void>;
}

class ErrorLogger implements IErrorLogger {
  private isDevelopment = import.meta.env.DEV;

  log(error: Error | AppError): void {
    if (this.isDevelopment) {
      console.error('[Error]', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(this.isAppError(error) && {
          code: error.code,
          statusCode: error.statusCode,
          data: error.data,
        }),
      });
    } else {
      // In production, log to service
      this.logToService(error).catch(console.error);
    }
  }

  async logToService(error: Error | AppError): Promise<void> {
    try {
      // Replace with actual error logging service (e.g., Sentry, LogRocket)
      // await fetch('/api/log-error', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     name: error.name,
      //     message: error.message,
      //     stack: error.stack,
      //   }),
      // });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  private isAppError(error: Error | AppError): error is AppError {
    return 'code' in error;
  }
}

export const errorLogger = new ErrorLogger();
```

#### Step 2.2.3: Create Error Boundary Component

**Create `src/components/errors/ErrorBoundary.tsx`:**

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '@/lib/errors/ErrorLogger';
import { AppError } from '@/lib/errors/AppError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    errorLogger.log(error);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Step 2.2.4: Create Error Fallback Component

**Create `src/components/errors/ErrorFallback.tsx`:**

```typescript
import { Button } from '@/components/ui';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Oops! Something went wrong</h1>
        <p className={styles.message}>{error.message}</p>
        {import.meta.env.DEV && (
          <pre className={styles.stack}>{error.stack}</pre>
        )}
        <Button onClick={resetError}>Try Again</Button>
      </div>
    </div>
  );
};
```

**Create `src/components/errors/ErrorFallback.module.css`:**

```css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.content {
  max-width: 600px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #dc2626;
}

.message {
  font-size: 16px;
  margin-bottom: 24px;
  color: #4b5563;
}

.stack {
  text-align: left;
  background: #f3f4f6;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin-bottom: 24px;
}
```

#### Step 2.2.5: Update Operator Registry (Remove console.warn)

**Update `src/core/operators/registry/operatorRegistry.ts`:**

```typescript
import { errorLogger } from '@/lib/errors/ErrorLogger';
import { AppError, ErrorCode } from '@/lib/errors/AppError';

export type OperatorFunction = (currentValue: string, conditionValue: string) => boolean;

const createOperatorRegistry = () => {
  const operators = new Map<string, OperatorFunction>();

  return {
    register: (operator: string, fn: OperatorFunction): void => {
      operators.set(operator, fn);
    },

    evaluate: (operator: string, currentValue: string, conditionValue: string): boolean => {
      const fn = operators.get(operator);

      if (!fn) {
        const error = new AppError(
          `Unknown operator: ${operator}`,
          ErrorCode.VALIDATION_ERROR
        );
        errorLogger.log(error);

        // Return true as fallback to prevent breaking the form
        return true;
      }

      return fn(currentValue, conditionValue);
    },

    has: (operator: string): boolean => operators.has(operator),
  };
};

export const operatorRegistry = createOperatorRegistry();
```

#### Step 2.2.6: Wrap Application with Error Boundary

**Update `src/main.tsx`:**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { ErrorFallback } from '@/components/errors/ErrorFallback';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<ErrorFallback error={new Error('Application Error')} resetError={() => window.location.reload()} />}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

#### Step 2.2.7: Create Custom Error Hook

**Create `src/hooks/useErrorHandler.ts`:**

```typescript
import { useCallback } from 'react';
import { errorLogger } from '@/lib/errors/ErrorLogger';
import { AppError } from '@/lib/errors/AppError';
import toast from 'react-hot-toast';

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error | AppError) => {
    errorLogger.log(error);

    // Show user-friendly error message
    const message = error instanceof AppError
      ? error.message
      : 'An unexpected error occurred';

    toast.error(message);
  }, []);

  return { handleError };
};
```

**Success Criteria:**
- ✅ Centralized error handling
- ✅ Error boundaries in place
- ✅ No console.warn in production code
- ✅ Errors logged to service in production
- ✅ User-friendly error messages

---

### 2.3 API Client Standardization

**Current Score:** Part of DIP → **Target Score:** Consistent usage

#### Step 2.3.1: Audit and Update All API Calls

**Find all direct axios usages:**

```bash
grep -r "import axios" src/ --include="*.ts" --include="*.tsx"
grep -r "axios\." src/ --include="*.ts" --include="*.tsx"
```

#### Step 2.3.2: Migrate formSubmissionApi

**Update `src/features/form/api/formSubmissionApi.ts`:**

```typescript
import { apiClient } from '@/lib/api';
import { prepareSubmitFormData } from '../utils';

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export interface SubmitFormResponse {
  followup_msg: string;
  approval_status: string;
  event_register_id: string;
  redirection: Record<string, unknown>;
  extra_tickets: unknown[];
  thank_you_new_page: boolean;
  is_online: boolean;
  type_of_event: string;
  has_invoice: boolean;
}

interface SubmitApiResponse {
  hasError: boolean;
  statusCode: number;
  message: Record<string, unknown>;
  response: SubmitFormResponse;
}

export const submitForm = async (
  eventId: string,
  formData: Record<string, string>,
  logId?: string | null
): Promise<SubmitApiResponse> => {
  const submitData = prepareSubmitFormData(formData, logId);

  const response = await apiClient.post<SubmitApiResponse>(
    `${API_BASE_URL}/${eventId}/submit/`,
    submitData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
```

#### Step 2.3.3: Create API Constants

**Create `src/config/apiEndpoints.ts`:**

```typescript
export const API_ENDPOINTS = {
  FORM: {
    SUBMIT: (eventId: string) => `/makemypass/public-form/${eventId}/submit/`,
    LOG: (eventId: string, logId: string) => `/makemypass/public-form/${eventId}/form-log/${logId}/`,
    INFO: (eventId: string) => `/makemypass/public-form/${eventId}/info/`,
  },
  EVENT: {
    DETAILS: (eventId: string) => `/events/${eventId}/`,
  },
} as const;
```

**Update `src/config/index.ts`:**

```typescript
export * from './constants';
export * from './env';
export * from './apiEndpoints';
```

**Success Criteria:**
- ✅ All API calls use centralized client
- ✅ API endpoints defined as constants
- ✅ Consistent error handling across API calls
- ✅ Easy to mock for testing

---

## Phase 3: Quality Enhancements

**Timeline:** Week 5-6
**Impact:** Medium
**Risk:** Low

### 3.1 Interface Segregation

**Current Score:** 8.5/10 → **Target Score:** 10/10

#### Step 3.1.1: Split FormField Interface

**Create `src/types/form/BaseField.types.ts`:**

```typescript
export interface BaseFieldProperties {
  id: string;
  type: string;
  field_key: string;
}

export interface FieldDisplay {
  title: string;
  description: string | null;
  placeholder: string;
  hidden: boolean;
}

export interface FieldValidation {
  required: boolean;
  unique: boolean | null;
  conditions: Record<string, unknown>;
}

export interface FieldConfiguration {
  page_num: number;
  property: Record<string, unknown>;
  options: Array<{
    values: string[];
    conditions: Record<string, unknown>;
  }>;
}

export interface FieldMetadata {
  team_field: boolean;
  admin_field?: boolean;
}
```

**Create `src/types/form/FormField.types.ts`:**

```typescript
import type {
  BaseFieldProperties,
  FieldDisplay,
  FieldValidation,
  FieldConfiguration,
  FieldMetadata,
} from './BaseField.types';

// Composed interface for backward compatibility
export interface FormField
  extends BaseFieldProperties,
    FieldDisplay,
    FieldValidation,
    FieldConfiguration,
    FieldMetadata {}

// Specific use-case interfaces
export type DisplayField = BaseFieldProperties & FieldDisplay;
export type ValidatableField = BaseFieldProperties & FieldValidation;
export type ConfigurableField = BaseFieldProperties & FieldConfiguration;
```

**Update `src/types/form.types.ts`:**

```typescript
export * from './form/BaseField.types';
export * from './form/FormField.types';
```

#### Step 3.1.2: Update Validators to Use Specific Interfaces

**Update validators:**

```typescript
import type { ValidatableField } from '@/types/form.types';

export type ValidatorFunction = (
  field: ValidatableField,
  value: string | undefined
) => ValidationResult;
```

#### Step 3.1.3: Update Components to Use Specific Interfaces

**Update `BaseFieldWrapper.tsx`:**

```typescript
import type { ReactNode } from 'react';
import type { DisplayField } from '@/types/form.types';
import styles from '../FormPage.module.css';

interface BaseFieldProps extends DisplayField {
  children: ReactNode;
}

const BaseFieldWrapper = ({ id, title, required, description, children }: BaseFieldProps) => {
  return (
    <div key={id} className={styles.fieldContainer}>
      <label className={styles.label}>
        {title}
        {required && <span className={styles.required}>*</span>}
      </label>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
};

export default BaseFieldWrapper;
```

**Success Criteria:**
- ✅ Interfaces split by concern
- ✅ Components only depend on needed properties
- ✅ Backward compatibility maintained
- ✅ Easier to extend and maintain

---

### 3.2 Documentation & Type Safety

**Current Score:** 9/10 → **Target Score:** 10/10

#### Step 3.2.1: Add JSDoc Comments to Core Functions

**Update validators with JSDoc:**

```typescript
/**
 * Validates email field format
 *
 * @param field - The form field configuration
 * @param value - The value to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * ```typescript
 * const result = emailValidator(field, 'test@example.com');
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const emailValidator: ValidatorFunction = (field, value) => {
  // Implementation
};
```

#### Step 3.2.2: Replace Record<string, unknown> with Specific Types

**Create specific types:**

```typescript
// Instead of Record<string, unknown>
export interface FieldProperty {
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  [key: string]: unknown;
}

export interface FieldConditions {
  field: string;
  operator: string;
  value: string;
}
```

#### Step 3.2.3: Add Type Guards

**Create `src/utils/typeGuards.ts`:**

```typescript
import type { FormField } from '@/types/form.types';
import type { AppError } from '@/lib/errors/AppError';

export function isFormField(value: unknown): value is FormField {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'field_key' in value
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'code' in error;
}

export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
```

#### Step 3.2.4: Add API Documentation

**Create `docs/API.md`:**

```markdown
# API Documentation

## Endpoints

### Form Submission

**POST** `/makemypass/public-form/{eventId}/submit/`

Submits form data for a specific event.

#### Parameters

- `eventId` (string, required): The unique identifier for the event

#### Request Body

```typescript
{
  [fieldKey: string]: string;
  form_log_id?: string;
}
```

#### Response

```typescript
{
  followup_msg: string;
  approval_status: string;
  event_register_id: string;
  // ... other fields
}
```

#### Example

```typescript
const response = await submitForm('event-123', {
  name: 'John Doe',
  email: 'john@example.com',
}, 'log-456');
```
```

**Success Criteria:**
- ✅ Core functions documented with JSDoc
- ✅ Specific types replace generic Records
- ✅ Type guards added for runtime checks
- ✅ API documentation complete

---

## Verification & Validation

### Automated Checks

Create `scripts/verify-migration.sh`:

```bash
#!/bin/bash

echo "Starting migration verification..."

# Run tests
echo "✓ Running tests..."
pnpm test:coverage || exit 1

# Run linter
echo "✓ Running linter..."
pnpm lint || exit 1

# Run type check
echo "✓ Type checking..."
pnpm tsc --noEmit || exit 1

# Check test coverage thresholds
echo "✓ Checking coverage thresholds..."
pnpm test:coverage --run || exit 1

# Run accessibility tests
echo "✓ Running accessibility tests..."
pnpm test -- --grep "a11y|accessibility" || exit 1

echo "✅ All verification checks passed!"
```

### Manual Checklist

**SOLID Principles:**
- [ ] SRP: Each module has single responsibility
- [ ] OCP: Can extend without modifying existing code
- [ ] LSP: Substitutable implementations work correctly
- [ ] ISP: No component depends on unused interfaces
- [ ] DIP: Business logic doesn't depend on frameworks

**Industry Standards:**
- [ ] 80%+ test coverage
- [ ] All accessibility tests pass
- [ ] ESLint shows no errors
- [ ] TypeScript compiles without errors
- [ ] No console.log/warn in production code
- [ ] Error boundaries catch all errors
- [ ] API calls use centralized client
- [ ] Documentation is complete

---

## Rollback Plan

### Before Migration

1. **Create backup branch:**
```bash
git checkout -b backup/pre-migration-$(date +%Y%m%d)
git push origin backup/pre-migration-$(date +%Y%m%d)
```

2. **Document current state:**
```bash
git log --oneline -10 > migration-rollback-point.txt
```

### During Migration

1. **Commit after each phase:**
```bash
git commit -m "feat: complete phase 1.1 - testing infrastructure"
git push origin feature/code-quality-improvements
```

2. **Tag stable points:**
```bash
git tag -a phase-1-complete -m "Phase 1 complete and verified"
git push origin phase-1-complete
```

### Rollback Procedure

**If issues arise:**

```bash
# Rollback to specific phase
git reset --hard phase-1-complete

# Or rollback to pre-migration
git reset --hard backup/pre-migration-$(date +%Y%m%d)

# Force push (only if necessary)
git push origin feature/code-quality-improvements --force
```

---

## Timeline & Resource Allocation

| Phase | Duration | Developers | Priority |
|-------|----------|------------|----------|
| Phase 1.1 (Testing) | 5 days | 2 | Critical |
| Phase 1.2 (Accessibility) | 2 days | 1 | Critical |
| Phase 2.1 (DIP) | 5 days | 2 | High |
| Phase 2.2 (Error Handling) | 4 days | 1 | High |
| Phase 2.3 (API Standardization) | 2 days | 1 | High |
| Phase 3.1 (Interface Segregation) | 3 days | 1 | Medium |
| Phase 3.2 (Documentation) | 3 days | 1 | Medium |
| **Total** | **24 days** | **2-3 devs** | - |

---

## Success Metrics

| Metric | Before | Target | Measurement |
|--------|--------|--------|-------------|
| Overall Score | 7.5/10 | 10/10 | Code review |
| Test Coverage | 0% | 80%+ | Vitest coverage |
| Accessibility Score | 5/10 | 10/10 | A11y tests |
| DIP Score | 6.5/10 | 10/10 | Architecture review |
| Error Handling | 6/10 | 10/10 | Error boundary tests |
| Build Errors | Unknown | 0 | CI/CD |
| ESLint Warnings | Unknown | 0 | Linter |

---

## Post-Migration Tasks

1. **Update CI/CD pipeline:**
   - Add test coverage requirements
   - Add accessibility checks
   - Add type checking step

2. **Team training:**
   - Document new patterns
   - Conduct code review sessions
   - Update contribution guidelines

3. **Monitoring:**
   - Set up error tracking (Sentry/LogRocket)
   - Monitor test coverage trends
   - Track accessibility metrics

---

## Support & Questions

For questions or issues during migration:
- Create GitHub issues with `migration` label
- Refer to this guide for step-by-step instructions
- Consult SOLID principles documentation

**Last Updated:** 2025-10-13
**Version:** 1.0.0
