// Created automatically by Cursor AI (2024-08-24)
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ObservabilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const startTime = Date.now();
    
    // TODO: Initialize OpenTelemetry tracer
    // const tracer = trace.getTracer('api-gateway');
    
    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;
        
        // Log successful request
        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms - Success`);
        
        // TODO: Send metrics to Prometheus
        // this.recordMetrics(method, url, duration, 200);
        
        // TODO: Send trace to OpenTelemetry
        // this.recordTrace(method, url, duration, 'success');
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        // Log error
        console.error(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms - Error: ${error.message}`);
        
        // TODO: Send error to Sentry
        // this.recordError(error, request);
        
        // TODO: Send metrics to Prometheus
        // this.recordMetrics(method, url, duration, error.status || 500);
        
        throw error;
      })
    );
  }

  private recordMetrics(method: string, url: string, duration: number, statusCode: number) {
    // TODO: Implement Prometheus metrics recording
    // Example:
    // http_request_duration_seconds.observe({ method, url, status_code: statusCode }, duration / 1000);
    // http_requests_total.inc({ method, url, status_code: statusCode });
  }

  private recordTrace(method: string, url: string, duration: number, status: string) {
    // TODO: Implement OpenTelemetry tracing
    // Example:
    // const span = tracer.startSpan(`${method} ${url}`);
    // span.setAttributes({
    //   'http.method': method,
    //   'http.url': url,
    //   'http.duration': duration,
    //   'http.status': status
    // });
    // span.end();
  }

  private recordError(error: any, request: any) {
    // TODO: Implement Sentry error reporting
    // Example:
    // Sentry.captureException(error, {
    //   extra: {
    //     method: request.method,
    //     url: request.url,
    //     body: request.body,
    //     user: request.user?.id
    //   }
    // });
  }
}
