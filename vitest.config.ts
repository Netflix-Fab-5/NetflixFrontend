// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Gör expect tillgängligt globalt utan att behöva importera det
    environment: 'jsdom', // Krävs för att hantera React-komponenter
  },
});
