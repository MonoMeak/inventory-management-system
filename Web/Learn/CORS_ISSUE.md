# CORS & Authentication Issue

## Problem

The backend API is returning `401 Unauthorized` for OPTIONS preflight requests to `/reports/summary`. This is a **backend configuration issue**.

### What's Happening

1. Browser sends OPTIONS request (CORS preflight) to check if the request is allowed
2. OPTIONS requests **cannot include Authorization headers** (browser limitation)
3. Backend requires authentication for OPTIONS requests (incorrect)
4. Browser blocks the actual GET request because preflight failed

## Proper Solution (Backend Fix Required)

The backend Spring Boot CORS configuration should be updated to **allow OPTIONS requests without authentication**.

### Backend Fix (Java/Spring Boot)

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .authorizeRequests()
            // Allow OPTIONS requests without authentication
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .antMatchers("/api/reports/**").authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Key Points

1. **`.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()`\*\* - Allow all OPTIONS requests without auth
2. **`setMaxAge(3600L)`** - Cache preflight responses to reduce OPTIONS requests
3. **`setAllowCredentials(true)`** - Required for sending credentials (JWT token)

## Workaround (Not Recommended)

If you cannot modify the backend immediately, you could:

### Option 1: Proxy the API (Development Only)

Update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Then update `.env`:

```bash
# Use relative URL to leverage Vite proxy
VITE_API_BASE_URL=/api
```

This eliminates CORS preflight because requests are same-origin.

### Option 2: Backend Proxy Server

Set up a Node.js proxy that adds authentication to OPTIONS requests (complex, not recommended).

## Testing the Fix

After the backend is fixed, verify:

1. **OPTIONS request succeeds without auth**

   ```bash
   curl -X OPTIONS http://localhost:8080/api/reports/summary \
     -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization"
   ```

   Expected response:

   - Status: 200 or 204
   - Headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.

2. **GET request succeeds with auth**

   ```bash
   curl -X GET http://localhost:8080/api/reports/summary \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

   Expected response:

   - Status: 200
   - Body: `{ "totalItems": 15, "lowStock": 5, "stockValue": 1234.56 }`

## Current Frontend Implementation

The frontend is correctly implemented:

- ✅ JWT token stored in localStorage
- ✅ Token included in Authorization header for actual requests
- ✅ CORS credentials included
- ✅ Proper error handling

**The issue is entirely on the backend CORS configuration.**

## Impact

This affects:

- `/api/reports/summary` endpoint (Dashboard)
- Any other authenticated endpoints when accessed from different origin
- Production deployments where frontend and backend are on different domains

## Priority

**HIGH** - Dashboard will not load until this is fixed.

## References

- [Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Preflight Requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
