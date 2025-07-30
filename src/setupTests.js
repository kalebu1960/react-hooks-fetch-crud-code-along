import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Suppress act warning
const originalError = console.error;


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
