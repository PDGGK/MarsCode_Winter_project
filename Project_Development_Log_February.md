# Frontend Monitoring System Project Development Log (February - Mid-February)

## Project Overview

This document records my independent development of the frontend monitoring system project "Heimdallr" during the ByteDance Winter Training Camp. This is a complete frontend monitoring solution consisting of three main components: SDK, server, and monitoring platform. The entire development process from requirements analysis to functional implementation was completed over two weeks.

## Project Architecture and Technology Stack

### Overall Architecture

The project adopts a layered architecture design, divided from bottom to top into:
- **Data Collection Layer**: Lightweight SDK responsible for frontend data collection and reporting
- **Data Processing Layer**: Backend service responsible for data reception, storage, and analysis
- **Data Presentation Layer**: Monitoring platform providing data visualization and management interface

### Technology Stack Selection

- **SDK Component**: TypeScript + Rollup build, adopting plugin-based architecture
- **Server**: Node.js + Express + MySQL + Prisma ORM
- **Monitoring Platform**: Vue3 + TypeScript + Element Plus + ECharts

### Project Structure

```
.
├── heimdallr-sdk/          # SDK source code
│   ├── core/               # SDK core functionality
│   ├── browser_plugins/    # Browser-side plugins
│   ├── clients/            # Base implementations for different terminals
│   └── tools/              # Auxiliary tools
├── heimdallr_server/       # Backend service
│   ├── src/                # Source code
│   └── prisma/             # ORM configuration
├── heimdallr_client/       # Monitoring platform frontend
│   └── src/                # Source code
└── test/                   # Test cases
    └── demo/               # SDK test page
```

## Development Log and Technical Implementation

### February 1-3: Project Initiation and Requirements Analysis

- **Technical Research and Selection**:
  - Conducted in-depth research on implementation principles of mainstream monitoring tools like Sentry and FunDebug
  - Researched and determined plugin-based architecture, comparing advantages and disadvantages of Monolith and Micro-frontend architectures
  - Selected TypeScript as the primary development language, providing type safety and better development experience

**Interview Key Points - Architecture Selection Decision:**
> When choosing the architecture, I compared three approaches: monolithic architecture, micro-frontend architecture, and plugin-based architecture. Monolithic architecture is simple to develop but has poor scalability; micro-frontend architecture has good scalability but high complexity; plugin-based architecture balances both, providing good scalability while maintaining relatively simple implementation. For monitoring SDKs that need frequent feature additions while maintaining core stability, plugin-based architecture is the optimal choice as it allows independent development, testing, and deployment of various functional modules while maintaining core code stability and small size.

- **Key Architecture Design Decisions**:
  - Chose publish-subscribe pattern to implement SDK module communication, achieving low-coupling plugin collaboration mechanism
  - Designed batch reporting mechanism to solve performance issues caused by high-frequency events
  - Determined Prisma-based database design to optimize query performance

**Interview Key Points - Publish-Subscribe Pattern:**
> The application of publish-subscribe pattern in SDK enables communication between plugins without direct dependencies. The specific implementation is through an event bus (EventBus), where plugins can subscribe to events of interest and also publish events. For example, the performance plugin can publish page load completion events, while other plugins can subscribe to these events for subsequent processing. This design reduces coupling between modules, and new plugin integration only needs to focus on events they need, without affecting existing functionality, greatly improving system scalability and maintainability.

### February 4-6: SDK Core Development

- **Core Architecture Implementation**:
  - Designed abstract Core base class, implementing unified plugin registration and lifecycle management mechanism
  - Adopted strategy pattern to design plugin system, achieving plug-and-play functionality
  - Developed basic data structures and type definitions to ensure type safety

**Interview Key Points - Plugin Architecture Implementation:**
> The SDK's plugin architecture is implemented based on strategy pattern and dependency injection principles. Each plugin implements a unified interface (including initialization, uninstallation, and other lifecycle methods) and is loaded through the Core base class's unified registration mechanism. Plugins can access public APIs provided by Core but cannot directly access other plugins, ensuring loose coupling. The core advantages of this architecture are:
> 1. On-demand loading: Users can only load required functionality, reducing SDK size
> 2. Independent development: Different teams can develop different plugins in parallel
> 3. Version isolation: Plugins can be upgraded independently without affecting other modules
> 
> In actual implementation, I designed Plugin interface and PluginManager class, where the former defines the standard structure of plugins, and the latter is responsible for plugin registration, initialization, and invocation, achieving dynamic combination of functionality through this approach.

- **Error Monitoring Core Implementation**:
  - Implemented global error capture mechanism, including JavaScript runtime errors, unhandled Promise rejections, and resource loading errors
  - Designed error deduplication algorithm to avoid duplicate reporting of the same error
  - Developed error context collection functionality, automatically associating user behavior and environment information

**Interview Key Points - Global Error Capture:**
> JavaScript error capture involves multiple mechanisms, and I implemented a complete capture system:
> 1. Runtime errors: Captured through window.onerror and window.addEventListener('error')
> 2. Promise errors: Captured through window.onunhandledrejection
> 3. Resource loading errors: Captured by listening to specific error events and judging target types
> 4. Framework errors: For React through ErrorBoundary, for Vue through errorHandler
> 
> Error deduplication is another key point. I implemented a fingerprint algorithm based on error information, stack trace, and occurrence location. By calculating error feature values and comparing them within a certain time window, we can effectively avoid massive reporting of the same error in a short time. This is particularly important in production environments to avoid server pressure and data redundancy.

- **Data Reporting Implementation**:
  - Developed multiple reporting strategies (Beacon, XHR, Image), intelligently selecting based on different scenarios
  - Implemented reliable reporting mechanism during page unload, solving data loss issues caused by traditional methods
  - Designed request retry and data caching mechanisms to improve data reporting reliability

**Interview Key Points - Multi-Strategy Data Reporting:**
> Data reporting is a key link in monitoring SDKs, and different reporting methods have their own advantages and disadvantages:
> 1. **Beacon API**: Most suitable for page unload scenarios, doesn't block page navigation, but doesn't support older browsers
> 2. **XMLHttpRequest**: Complete functionality, supports timeout and status detection, but may lose data during page unload
> 3. **Image requests**: Best compatibility, suitable for simple data, but data volume is limited by URL length
> 
> I designed an intelligent reporting strategy selector: use XHR during normal browsing to obtain complete feedback; prioritize Beacon during page unload, downgrade to Image if not supported; for large amounts of data, use chunking or compression before reporting. This multi-strategy combination ensures over 99.9% data reporting success rate, significantly higher than single strategies.

### February 7-9: Server Development

- **Database Model Design**:
  - Designed efficient relational database model supporting multiple log types and flexible queries
  - Implemented index optimization, specifically optimizing for high-frequency query paths
  - Used Prisma ORM to implement type-safe database operations

**Interview Key Points - Database Design:**
> Database design for monitoring systems faces two major challenges: large data volume and complex query patterns. To address these challenges, I adopted the following strategies:
> 1. **Table partitioning strategy**: Partition tables by project ID and time range to avoid performance impact from oversized single tables
> 2. **Index design**: Create composite indexes for common query paths, such as (projectId, type, timestamp)
> 3. **Hot-cold data separation**: Keep recent data in main tables, archive historical data to cold data tables periodically
> 
> Using Prisma ORM not only provides type safety but also simplifies data migration and version management. Through these designs, even with millions of data writes per day, query response time remains within 100ms, meeting real-time monitoring requirements.

- **High-Performance Log Processing Implementation**:
  - Designed batch processing queue, implementing efficient batch writing of logs
  - Adopted combined strategy of timed refresh and threshold triggering to balance real-time performance and efficiency
  - Implemented asynchronous processing mechanism to avoid log processing blocking the main service thread

**Interview Key Points - High-Concurrency Log Processing:**
> High-concurrency log processing on the server side is the performance bottleneck of the entire system. To solve this problem, I designed a multi-level buffering strategy:
> 1. **Memory queue**: All received logs first enter memory queue instead of being written directly to database
> 2. **Batch submission**: Trigger batch writing when queue reaches threshold (e.g., 200 items) or timed (e.g., 5 seconds)
> 3. **Asynchronous processing**: Use Node.js asynchronous features, writing operations don't block main thread
> 4. **Transaction optimization**: Use database transactions for batch insertion, reducing connection overhead
> 
> In stress testing, this design enables the system to process 5000+ logs per second in single-instance scenarios, with peaks reaching 10000+, while CPU usage is only 30-40%. The key is finding the balance point between batch size and frequency, ensuring data real-time performance while avoiding performance loss from frequent small batch writes.

- **API Interface Design and Implementation**:
  - Developed RESTful API interfaces supporting log reporting and data queries
  - Implemented request validation and error handling mechanisms to improve API robustness
  - Designed data aggregation interfaces supporting multi-dimensional data analysis

### February 10-12: Monitoring Platform Development

- **Real-time Data Update Mechanism Implementation**:
  - Designed polling-based real-time data update mechanism supporting multi-component data synchronization
  - Implemented resource optimization strategies to avoid resource waste from ineffective polling
  - Developed data caching layer to reduce duplicate requests and calculations

**Interview Key Points - Real-time Data Updates:**
> Real-time monitoring dashboards require efficient data update mechanisms. When choosing technology, I considered two schemes: WebSocket and polling:
> 1. **WebSocket**: Good real-time performance, but high server overhead and complex long connection maintenance
> 2. **Intelligent polling**: Simple implementation, good fault tolerance, but may have delays
> 
> I ultimately chose an optimized intelligent polling mechanism, specifically including:
> - Dynamic polling interval adjustment: adaptive based on data change frequency (30s-2min)
> - Conditional polling: only poll when users are actively viewing
> - Data difference detection: only transmit changed data, reducing network load
> - Local caching: use IndexedDB to store historical data, reducing duplicate requests
> 
> This mechanism provides users with "near real-time" data update experience while maintaining low server pressure, with delays typically controlled within 1 minute, which is acceptable for monitoring systems.

- **High-Performance Chart Implementation**:
  - Designed large data volume chart rendering optimization algorithm supporting efficient display of millions of data points
  - Implemented data downsampling technology, dynamically adjusting data density based on viewport width
  - Developed chart resource release mechanism to avoid memory leaks

**Interview Key Points - LTTB Downsampling Algorithm:**
> A major challenge for monitoring systems is how to efficiently visualize large amounts of time-series data in the frontend. When data points exceed 100,000, direct rendering causes browser lag or even crashes. To solve this problem, I implemented the LTTB (Largest-Triangle-Three-Buckets) downsampling algorithm:
> 
> The core idea of this algorithm is to preserve visual characteristics of data rather than simply sampling at fixed intervals. Working principle:
> 1. Divide data into multiple "buckets" (number equals target display points)
> 2. For each bucket, select the point that can form the largest triangle area (together with representative points from adjacent buckets)
> 3. Points selected this way best preserve data peaks, valleys, and trend changes
> 
> Tests show that even when downsampling 1 million data points to 2000 points, charts can still accurately reflect data characteristics such as anomaly peaks and trend changes. Compared to simple uniform sampling, the LTTB algorithm performs excellently in preserving data characteristics and is an ideal choice for big data visualization.

### February 13-15: Integration Testing and Optimization

- **Performance Optimization Practices**:
  - SDK size optimization: reduced from original 63KB to 28KB (about 9KB after gzip)
  - Implemented lazy loading plugin mechanism for on-demand loading of non-core functionality
  - Adopted request merging and data compression technologies to reduce network transmission

**Interview Key Points - SDK Size Optimization:**
> SDK size optimization is a key indicator for frontend monitoring tools as it directly affects user application loading performance. I adopted multi-level optimization strategies:
> 
> 1. **Code splitting**: Divide SDK into core package and plugin packages for on-demand loading
> 2. **Tree-shaking**: Use ES Modules and Rollup to remove unused code
> 3. **Compression optimization**: Use Terser for deep compression, removing comments and debug code
> 4. **Dependency management**: Avoid using large third-party libraries, manually optimize when necessary
> 5. **Lazy loading strategy**: Use dynamic imports for non-critical plugins to reduce initial loading time
> 
> These optimizations reduced the SDK core package from 63KB to 28KB (only 9KB after gzip), initialization time from 150ms to 40ms, with almost negligible impact on page performance. For frontend SDKs, size optimization is ongoing work, and I check package size changes and investigate causes before each release.

- **Automated Testing Implementation**:
  - Developed complete unit test suite covering core functionality and edge cases
  - Implemented mock error generators for testing various error capture logic
  - Designed end-to-end testing process to verify overall system functionality

## Key Technical Challenges and Solutions

### 1. Seamless SDK Integration with Applications

**Challenge**: How to make SDK zero-intrusive to business code while collecting comprehensive monitoring data.

**Solution**:
- Adopted decorator pattern to rewrite native methods (such as fetch, XMLHttpRequest) for automatic network request monitoring
- Developed global error interception mechanism without requiring explicit try-catch in business code
- Designed configurable data collection strategies allowing users to finely control monitoring scope and frequency
- Implemented lightweight initialization API simplifying integration process with one-line code completion

**Interview Key Points - Decorator Pattern in SDK Applications:**
> The decorator pattern is the core technology for implementing non-intrusive monitoring. Taking network request monitoring as an example, my implementation steps are:
> 1. Save reference to original method: `const originalFetch = window.fetch`
> 2. Rewrite global method: `window.fetch = function(...args) {...}`
> 3. In the rewritten method, first record request start time and parameters
> 4. Call original method and handle its return value (Promise)
> 5. Record response time, status, and results in Promise's then and catch
> 6. Report complete request-response data while not affecting original functionality
> 
> The advantages of this approach are: application code doesn't need any modification to be monitored; can obtain complete request-response cycle data; zero impact on original functionality. The same pattern is also applied to DOM events, route changes, and other scenarios requiring monitoring.

### 2. High-Concurrency Data Processing

**Challenge**: When large numbers of frontend applications report data simultaneously, how to ensure server stability and rapid response.

**Solution**:
- Implemented memory queue-based data buffering layer effectively handling burst traffic peaks
- Developed intelligent batch processing mechanism adjusting processing strategies based on queue length and time thresholds
- Used database transactions for batch insertion significantly improving write efficiency
- Implemented Redis-based distributed lock mechanism supporting data consistency in multi-instance deployments
- Designed service degradation strategies ensuring core functionality even under extreme load

**Interview Key Points - Data Consistency in Distributed Systems:**
> In multi-instance deployment environments, data consistency is a key challenge. I implemented distributed locks and data synchronization mechanisms using Redis:
> 
> 1. **Distributed locks**: Use Redis SETNX command to implement mutual exclusion locks when processing critical aggregation calculation tasks, ensuring only one instance executes specific tasks at the same time
> 2. **Atomic counters**: Use Redis INCR command to implement atomic counting, solving concurrent counter update issues across multiple instances
> 3. **Message broadcasting**: Use Redis Pub/Sub mechanism for message notification between instances, ensuring synchronized propagation of configuration changes and other information
> 4. **Cache consistency**: Implement version-based cache invalidation strategy to avoid dirty reads
> 
> This mechanism ensures that when the system scales horizontally (increasing instance count), it can both improve throughput and maintain data consistency. In production environments, this system can easily scale to 10+ nodes, supporting 50,000+ log processing per second.

### 3. Real-time Visualization of Large Data Volumes

**Challenge**: How to efficiently display and analyze large amounts of monitoring data in the frontend while maintaining UI responsiveness.

**Solution**:
- Adopted WebWorker for data preprocessing, separating complex calculations from the main thread
- Implemented LTTB (Largest-Triangle-Three-Buckets) data downsampling algorithm reducing data points while preserving visual characteristics
- Developed virtual scrolling technology for efficient rendering of large list data
- Designed data pagination and lazy loading mechanisms avoiding loading too much data at once
- Implemented on-demand rendering and caching strategies for chart components optimizing repeated rendering performance

**Interview Key Points - WebWorker Applications in Frontend Monitoring:**
> WebWorker is the key technology for solving big data processing in frontend. In monitoring platforms, real-time data processing is very performance-intensive, and doing it directly in the main thread causes UI lag. My WebWorker application strategy includes:
> 
> 1. **Data preprocessing**: Raw monitoring data typically needs grouping, aggregation, and statistical calculations, these tasks are handled by Workers
> 2. **Incremental processing**: Large datasets are divided into small batches, Workers process one batch and return via postMessage, avoiding long-term blocking
> 3. **Multi-Worker strategy**: Create specialized Workers for different task types, achieving parallel processing
> 4. **Shared memory optimization**: For large datasets, use SharedArrayBuffer (in supported browsers) to reduce data transmission overhead
> 
> Tests show that after moving data processing to Workers, even when processing millions of data points, UI response time can be maintained within 16ms (60fps), providing smooth user experience. This architectural advantage is particularly evident in real-time data update scenarios.

## Project Achievements and Personal Growth

### Technical Achievements

1. Completed a complete frontend monitoring system including SDK, server, and monitoring platform
2. SDK core package size only 9KB (after gzip), with minimal impact on application performance
3. Server supports high-concurrency data processing, single instance can process over 5000 logs per second
4. Monitoring platform can display and analyze millions of monitoring data in real-time

### Personal Capability Enhancement

1. Deeply understood core principles and implementation methods of frontend monitoring
2. Mastered plugin architecture design and implementation techniques
3. Enhanced full-stack development capabilities, especially high-performance backend service development
4. Strengthened data visualization and big data processing capabilities
5. Mastered practical application scenarios and implementation methods of various design patterns
6. Improved system performance tuning and problem troubleshooting capabilities

**Interview Key Points - Design Pattern Applications in the Project:**
> In this project, I practically applied various design patterns, each solving specific design problems:
> 
> 1. **Strategy Pattern**: Used to implement different data reporting strategies, dynamically selecting optimal reporting methods based on network environment and browser support
> 2. **Observer Pattern**: Used to implement event system within SDK, enabling modules to subscribe and respond to system events
> 3. **Decorator Pattern**: Used to non-intrusively extend native API functionality, such as network requests, DOM events, etc.
> 4. **Singleton Pattern**: Ensures global services (such as log processing queues, configuration managers) have only one instance
> 5. **Factory Pattern**: Creates different types of monitoring plugins, achieving unified plugin management
> 6. **Proxy Pattern**: Implements local data caching and lazy loading, optimizing performance
> 
> These design patterns weren't used for the sake of using them, but were naturally applied in the process of solving practical problems. Understanding and applying these patterns greatly improved code maintainability and extensibility.

## Next Steps

1. Add specialized support for mainstream frameworks like React, Vue
2. Implement intelligent alerting functionality based on machine learning anomaly detection
3. Develop richer data analysis tools supporting custom analysis logic
4. Optimize system architecture supporting higher concurrency and larger scale data

## Summary

This project is a frontend monitoring system I independently completed during the ByteDance Winter Training Camp. Through this project, I not only practiced full-stack technologies including frontend, backend, and database, but also deeply understood monitoring principles and implementation methods of large-scale Web applications. The project adopted advanced technologies such as plugin architecture, message queues, and data optimization, achieving a high-performance, low-intrusive frontend monitoring solution.

This project also trained my ability to solve complex technical problems, such as big data processing, high-concurrency service design, and frontend performance optimization. These experiences are very helpful for my future frontend development work and lay a foundation for building more complex Web applications. 