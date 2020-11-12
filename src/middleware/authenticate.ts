export default function authenticate(
  onyx: any,
  name: string | Array<string>,
  options?: any,
  callback?: Function
) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  let multi = true;

  if (!Array.isArray(name)) {
    name = [name];
    multi = false;
  }

  return async function authenticate(context: any, next?: Function) {
    interface failureObj {
      challenge: any;
      status?: number;
    }
    const failures: Array<failureObj> = [];

    async function allFailed() {
      if (callback) {
        if (!multi) {
          return callback(
            null,
            false,
            failures[0].challenge,
            failures[0].status
          );
        } else {
          const challenges = failures.map((failure) => failure.challenge);
          const statuses = failures.map((failure) => failure.status);
          return callback(null, false, challenges, statuses);
        }
      }

      let msg: string;
      const failure: failureObj = failures[0] || {};

      let challenge: any = failure.challenge || {};
      if (options.failureMessage) {
        if (typeof options.failureMessage === 'boolean') {
          msg = challenge.message || challenge;
        } else msg = options.failureMessage;
        if (!context.state.onyx.session.message) {
          context.state.onyx.session.message = [];
        }
        context.state.onyx.session.message.push(msg);
      }

      if (options.failureRedirect) {
        context.response.redirect(options.failureRedirect);
      }

      const rchallenge: Array<string> = [];
      let rstatus: undefined | number;

      failures.forEach((failure) => {
        const challenge = failure.challenge;
        const status = failure.status;

        rstatus = rstatus || status;

        if (typeof challenge === 'string') {
          rchallenge.push(challenge);
        }
      });
      context.response.status = rstatus || 401;
      if (context.response.status === 401 && rchallenge.length) {
        context.response.headers.set('WWW-Authenticate', rchallenge);
      }
    }

    await (async function attempt(i) {
      const layer = name[i];
      if (!layer) return allFailed();

      const prototype = onyx._strategies[layer];

      if (!prototype) {
        return context.throw(
          new Error(`Unknown authentication strategy ${layer}`)
        );
      }

      const strategy = Object.create(prototype);

      strategy.funcs.success = async function (user: object, info?: any) {
        if (callback) return callback(null, user, info);

        info = info || {};
        let msg;

        if (options?.successMessage) {
          if (typeof options.successMessage === 'boolean') {
            msg = info.message || info;
          } else msg = options.successMessage;
          if (typeof msg === 'string') {
            context.state.onyx.session.message =
              context.state.onyx.session.message || [];
            context.state.onyx.session.message.push(msg);
          }
        }

        await context.state.logIn(context, user, async function (err: any) {
          if (err) {
            throw new Error(err);
          }

          async function complete() {
            if (options.successRedirect) {
              return context.response.redirect(options.successRedirect);
            }
            next && (await next());
          }

          await complete();
        });
      };

      strategy.funcs.fail = async function (challenge: any, status?: number) {
        if (typeof challenge === 'number') {
          status = challenge;
          challenge = undefined;
        }
        failures.push({ challenge, status });
        attempt(i + 1);
      };

      // for anonymous
      strategy.funcs.pass = async function () {
        next && (await next());
      };

      strategy.funcs.error = async function (err: any) {
        if (callback) {
          return callback(err);
        }
        next && (await next());
      };

      await strategy.authenticate(context, options);
    })(0);
  };
}
