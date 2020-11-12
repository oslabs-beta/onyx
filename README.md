# Welcome to Onyx!

Onyx is authentication middleware for Deno inspired by Passport.js. Like Passport, Onyx prioritizes modularization and flexibility — it abstracts much of the authentication process away yet leaves exact control of the verification procedure up to the developer.

Onyx's primary concern is keeping code clean and organized. Through the use of specialized instructions called strategies, which are held in individual modules, you can streamline your authentication process without importing unnecessary dependencies.

All you need is one line to get started.

```typescript
import Onyx from  
```

When you import the Onyx module, what you're really importing is an object called 'Onyx' that has a number of built-in methods. A couple of those methods you will need to use as Oak middleware to use Onyx. Others are primarily used by Onyx under the hood to assist with the authentication process. However, if you are a developer interested in creating new or custom strategies for Onyx, it will likely be important to understand how these work.

## Where to Start
First, though, let's go over Onyx's most vital methods: `onyx.use()`, `onyx.authenticate()` and `onyx.initialize()`.

### onyx.use
`onyx.use()` configures and stores a strategy to to be implemented later on by Onyx. This step must be completed first in order to continue authentication process. After all, without a strategy, Onyx doesn't have anything to use to complete the authentication process.

### onyx.authenticate
`onyx.authenticate()` is the heart of Onyx — it's what you will use to initiate an authenticate process.

When you want to authenticate a user, simply invoke `onyx.authenticate()` and pass in a reference to the strategy you stored with `onyx.use()` above.

### onyx.initialize
As you might expect, `onyx.initialize()` creates a new instance of Onyx for each user and sets up its initial state. Though it's a simple line of code, it is vital for ensuring Onyx autehnticates each individual user properly.

## Serialization and Deserialization
Use the following two functions if you are creating persistent sessions for your users.

### onyx.serializeUser
Similar to `onyx.use()`, `onyx.serializeUser()` stores a callback you write that will be invoked later upon successful verification and authentication. This callback should serialize and store user information in some sort of session database.

### onyx.deserializeUser
Stores a callback you write that will be invoked later upon successful verification and authentication. This callback should deserialize user information, checking to see if the user has an existing session. If so, it should then grab the relevant user data from wherever you stored it.

## Digging Deeper
While the following methods are not required to authenticate with Onyx, you may find them useful to understand if you are creating a custom strategy.

### onyx.unuse
`onyx.unuse()` does exactly what it sounds like it does: It deletes the strategy you stored when using `onyx.use()`.

### onyx.init
`onyx.init()` is invoked every time a new instance of an Onyx object is created. It creates an instance of the session manager, which controls and creates user sessions.
