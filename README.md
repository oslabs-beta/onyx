![Onyx Logo](https://i.imgur.com/SglpX1j.png)

Welcome to Onyx!

Onyx is authentication middleware for Deno, inspired by [Passport.js](http://www.passportjs.org/). Like Passport, Onyx prioritizes modularization and flexibility — it abstracts much of the authentication process away yet leaves exact control of the verification procedure up to the developer.

Onyx's primary concern is keeping code clean and organized. Through the use of specialized instructions called strategies, which are held in individual modules, you can streamline your authentication process without importing unnecessary dependencies.

All you need is one line to get started.

```typescript
import onyx from 'https://deno.land/x/onyx@v1.0/mod.ts'
```

When you import the Onyx module, what you're really importing is an instance of 'Onyx' that has a number of built-in methods. While some of these methods you will invoke yourself, others are primarily used by Onyx under the hood to assist with the authentication process. However, if you are a developer interested in creating new or custom strategies for Onyx, it will likely be important to understand how these work.

By the way, you will need to use the [Oak](https://deno.land/x/oak@v6.3.1) framework for Deno to use Onyx. Additionally, you will need to set up the [session module](https://deno.land/x/session@1.1.0) on the server to use persistent sessions with Onyx. 

## Where to Start

Before doing anything else, it's important to import the authentication strategies you want to use in your application. These strategies are available on our [website](http://onyxts.land) and on our [Deno.land page](https://deno.land/x/onyx/src/strategies).

For example, importing in the local strategy looks like this.

```typescript
import LocalStrategy from 'deno.land/x/onyx@v1.0/src/strategies/local-strategy/local-strategy.ts'
```

Next, let's go over Onyx's most vital methods: `onyx.use()`, `onyx.authenticate()` and `onyx.initialize()`.

### onyx.use

`onyx.use()` configures and stores a strategy to to be implemented later on by Onyx. This step must be completed first in order to continue authentication process. After all, without a strategy, Onyx doesn't have anything to use to complete the authentication process.

```typescript
onyx.use(
  new LocalStrategy(
    async (username: string, password: string, done: Function) => {
      // const { username, password } = context.state.onyx.user;
      console.log(
        `verify function invoked with username ${username} and password ${password}`
      );
      try {
        const user = await User.findOne({ username });
        if (user && password === user.password) await done(null, user);
        else await done(null);
      } catch (error) {
        await done(error);
      }
    }
  )
);
```
To be clear, the developer must provide the user verification callback that the strategy will use, so that it will work for your particular application.

### onyx.authenticate

`onyx.authenticate()` is the heart of Onyx — it's what you will use to initiate an authenticate process.

When you want to authenticate a user, simply invoke `onyx.authenticate()` and pass in a reference to the strategy you stored with `onyx.use()` above.

```typescript
onyx.authenticate('local');
```

### onyx.initialize

As you might expect, `onyx.initialize()` creates a new instance of Onyx for each user and sets up its initial state. Though it's a simple line of code, it is vital for ensuring Onyx autehnticates each individual user properly.

```typescript
app.use(onyx.initialize());
```
Because a new instance should be created for each user, in this example, we are using Oak's `app.use()` function, which will invoke `onyx.initialize()` when a user makes an initial get request to the website/application.

## Serialization and Deserialization

Use the following two functions if you are creating persistent sessions for your users.

### onyx.serializeUser

Similar to `onyx.use()`, `onyx.serializeUser()` stores a callback that will be invoked later upon successful verification and authentication. This callback should serialize and store user information in some sort of session database.

```typescript
onyx.serializeUser(async function (user: any, cb: Function) {
  await cb(null, user._id.$oid);
});
```

Once again, the developer must provide the serializer callback that `serializeUser()` will store.

### onyx.deserializeUser

Stores a callback you write that will be invoked later upon successful verification and authentication. This callback should deserialize user information, checking to see if the user has an existing session. If so, it should then grab the relevant user data from wherever you stored it.

```typescript
onyx.deserializeUser(async function (id: string, cb: Function) {
  const _id = { $oid: id };
  try {
    const user = await User.findOne({ _id });
    await cb(null, user);
  } catch (error) {
    await cb(error, null);
  }
});
```

And yes, the developer must provide the deserializer callback that `deserializeUser()` will store.

## Digging Deeper

While the following methods are not required to authenticate with Onyx, you may find them useful to understand if you are creating a custom strategy.

### onyx.unuse

`onyx.unuse()` does exactly what it sounds like it does: It deletes the strategy you stored when using `onyx.use()`.

```typescript
onyx.unuse('local')
```

### onyx.init

`onyx.init()` is invoked every time a new instance of an Onyx object is created — it's actually in Onyx's constructor, so you probably won't have to worry about calling it yourself. 

It creates an instance of the session manager, which controls and creates user sessions.

## Developed by
[Connie Cho](https://github.com/chcho2), [Alice Fu](https://github.com/alicejfu), [Chris Kopcow](https://github.com/opennoise1), [George Kruchinina](https://github.com/gkruchin) and [Cedric Lee](https://github.com/leeced94)

Logo by [Amanda Maduri](https://www.linkedin.com/in/amanda-maduri/)
