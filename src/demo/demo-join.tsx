import { BULLET_METHOD } from "declarative-fluent-bullet-api/fluent/constants";
import { useEffect, useState } from "react";
import {
  createDeclarativeBulletApi,
  loginBulletIO_01,
} from "../_factory/prerequisites";
import { utils } from "../_utils/utils";
import { store } from "../_store/store";
import { BulletLogsComponent } from "../_components/bullet-logs-component";
import BulletLog from "../_models/BulletLog";
import { helpers } from "../_utils/helpers";
import * as randomWords from "random-words";
import { UserPassword } from "../user/user-password";

export const DemoJoin = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "JOIN";
  const POST_COLLECTION = "post8";
  const COMMENT_COLLECTION = "comment8";
  const JOIN_SAMPLE_KEY = "JOIN_SAMPLE_KEY";
  const firstCommentGuid = "3f290626-681b-4ea8-a7e3-0b557bfb15f8";

  const getSampleData = () => {
    return store.get(JOIN_SAMPLE_KEY);
  };

  useEffect(() => {
    const list: any[] = [];

    /* #region  data prerequisites */
    const dataBullet = new BulletLog({
      title: "insert sample data used by below finding examples",
      description: `

      // inserts into posts and comments
      // for the first comment, add some votes into votes-{guid}

      const insertResponse = await createDeclarativeBulletApi()
      .body(posts)
      .collection((c: any) =>
        c.name(POST_COLLECTION).method(BULLET_METHOD.INSERT)
      )
      .flow((f) =>
        f
          .body(comments)
          .collection((c: any) =>
            c.name(COMMENT_COLLECTION).method(BULLET_METHOD.INSERT)
          )
          .flow((f) =>
            f
              .body(votes)
              .collection((c) =>
                c.name("votes-" + comments[0].guid).method(BULLET_METHOD.INSERT)
              )
          )
      )
      .execute()
      `,
    });

    dataBullet.func = () => insertPostsCommentsVotesPrerequisites(dataBullet);

    list.push(dataBullet);
    store.set("FIND_PREREQ", dataBullet);

    /* #endregion */

    //------------------------

    /* #region  join one on one */
    const b1 = new BulletLog({
      title: "join one on one",
      description: `
      // returns the post and associated comment (into one request)
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name("zsys-users").method(BULLET_METHOD.FIND_ONE)
              )
              .field("_id")
          )
          .key("ADDED_BY")
          .field("userid")
      )
      .execute()
      `,
    });
    b1.func = () => join1on1(b1);
    list.push(b1);
    /* #endregion */

    //------------------------

    /* #region  join one on one */
    const nestedjoin = new BulletLog({
      title: "nested joins",
      description: `
      // returns the post and associated comment (into one request)
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name("zsys-users").method(BULLET_METHOD.FIND_ONE)
              )
              .field("_id")
          )
          .key("ADDED_BY")
          .field("userid")
      )
      .execute()
      `,
    });
    nestedjoin.func = () => nestedjoinFunc(nestedjoin);
    list.push(nestedjoin);
    /* #endregion */

    //------------------------

    /* #region  find by guid (from body) */
    const b2 = new BulletLog({
      title: "join one on many",
      description: `
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND)
              )
              .field("postGuid")
          )
          .key('my_comments')
          .field("guid")
      )
      .execute()
      `,
    });
    b2.func = () => join1onMany(b2);

    list.push(b2);
    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b3 = new BulletLog({
      title: "join one on many (with pagination)",
      description: `
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND)
              )
              .field("postGuid")
              .page((p) => p.itemsOnPage(2).pageNo(1))
          )
          .sort((s) => s.field("text"))
          .key("my_comments")
          .field("guid")
      )
      .execute()
      `,
    });
    b3.func = () => join1onManyWithPagination(b3);
    list.push(b3);
    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b4 = new BulletLog({
      title: "join many on one",
      description: `
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .execute()
      `,
    });
    b4.func = () => joinManyOn1(b4);
    list.push(b4);
    /* #endregion */

    //------------------------

    /* #region  find multiple consitions (only equality is considered) */
    const b5 = new BulletLog({
      title: "join many on many",
      description: `
      const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
      .join((j) =>
        j
          .with((w) =>
              w.collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .execute()
      `,
    });
    b5.func = () => joinManyOnMany(b5);
    list.push(b5);
    /* #endregion */

    //------------------------

    /* #region  find multiple consitions (only equality is considered) */
    const b6 = new BulletLog({
      title: "many on many with pagination",
      description: `
      const response = await createDeclarativeBulletApi()
        .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
        .join((j) =>
          j
            .with((w) =>
              w
                .collection((c) =>
                  c.name(COMMENT_COLLECTION).method(BULLET_METHOD.PAGINATION)
                )
                .field("postGuid")
            )
            .field("guid")
            .page((p) => p.itemsOnPage(2).pageNo(1))
            .sort((s) => s.field("text").ascending(false))
        )
        .execute()
      `,
    });
    b6.func = () => joinManyOnManyWithPagination(b6);
    list.push(b6);
    /* #endregion */

    //
    store.setEventValues(EVENT_NANME, list, true);
  }, []);

  const checkPrerequisites = async () => {
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    const sampleData = getSampleData();
    if (!sampleData) {
      const prereqBulletObject = store.get("FIND_PREREQ");
      if (!prereqBulletObject) {
        throw new Error("no prereqBulletObject");
      }
      await prereqBulletObject?.execute();
    }
  };

  const handleClick = () =>
    helpers.chain1([
      // wait,
      // inserArray2,
      // inser_PredefinedFunction3,
      // insert_ModuleFunction4,
      // inserDemo3_BodyFieldMyServer,
    ]);
  // inserDemo1().then(() => wait().then(() => inserDemoBulk()));

  // useEffect(() => {
  //   getBulletToken();
  // }, []);

  /* #region  Prerequisites */
  const insertPostsCommentsVotesPrerequisites = async (
    bulletLog: BulletLog
  ) => {
    //keep is as it is and don't call checkPrerequisites
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    // const checkIfAlreadyPopulated = await createDeclarativeBulletApi()
    //   .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
    //   .execute({});

    // if (checkIfAlreadyPopulated.data.length) {
    //   store.set(JOIN_SAMPLE_KEY, checkIfAlreadyPopulated.data);
    //   //already inserted
    //   return;
    // }

    const posts: any = [];
    const comments: any = [];

    const generateCommentForPost = (guid: string) => {
      const comment = {
        date: new Date(),
        text: randomWords.default(2).join(","),
        guid: utils.createUUID(),
        postGuid: guid,
      };

      return comment;
    };

    const generateCommentsForPost = (guid: string) => {
      const no = Math.floor(Math.random() * 21);
      let comment = null;
      for (var i = 0; i < no; i++) {
        comment = generateCommentForPost(guid);
        if (!comments.length) {
          comment.guid = firstCommentGuid;
        }
        comments.push(comment);
      }
    };

    const generatePost = () => {
      const guid = utils.createUUID();
      const post = {
        date: new Date(),
        text: randomWords.default(2).join(","),
        guid,
      };

      generateCommentsForPost(guid);

      return post;
    };

    const generatePosts = () => {
      for (var i = 0; i < 20; i++) {
        const post = generatePost();
        posts.push(post);
      }
    };

    generatePosts();

    const votes = [
      {
        guid: utils.createUUID(),
        date: new Date(),
      },
    ];

    const guid = utils.createUUID();
    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body(posts)
      .collection((c: any) =>
        c.name(POST_COLLECTION).method(BULLET_METHOD.INSERT)
      )
      .flow((f) =>
        f
          .body(comments)
          .collection((c: any) =>
            c.name(COMMENT_COLLECTION).method(BULLET_METHOD.INSERT)
          )
          .flow((f) =>
            f
              .body(votes)
              .collection((c) =>
                c.name("votes-" + firstCommentGuid).method(BULLET_METHOD.INSERT)
              )
          )
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    return;

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid })
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    store.set("JOIN_SAMPLE_KEY", findResponse.data);

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;

    return findResponse.data;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const join1on1 = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name("zsys-users").method(BULLET_METHOD.FIND_ONE)
              )
              .field("_id")
          )
          .key("ADDED_BY")
          .field("userid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on 1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const nestedjoinFunc = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
          .join((j) =>
            j.with((w) =>
              w.collection((c) =>
                c.name("votes-" + firstCommentGuid).method(BULLET_METHOD.FIND)
              )
            )
          )
      )
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name("zsys-users").method(BULLET_METHOD.FIND_ONE)
              )
              .field("_id")
          )
          .key("ADDED_BY")
          .field("userid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on 1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const join1onMany = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND)
              )
              .field("postGuid")
          )
          .key("my_comments")
          .field("guid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on many";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const join1onManyWithPagination = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.PAGINATION)
              )
              .field("postGuid")
          )
          .page((p) => p.itemsOnPage(2).pageNo(1))
          .sort((s) => s.field("text"))
          .key("my_comments")
          .field("guid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on many";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const joinManyOn1 = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND_ONE)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on 1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const joinManyOnMany = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.FIND)
              )
              .field("postGuid")
          )
          .field("guid")
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join many on many";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const joinManyOnManyWithPagination = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(POST_COLLECTION).method(BULLET_METHOD.FIND))
      .join((j) =>
        j
          .with((w) =>
            w
              .collection((c) =>
                c.name(COMMENT_COLLECTION).method(BULLET_METHOD.PAGINATION)
              )
              .field("postGuid")
          )
          .field("guid")
          .page((p) => p.itemsOnPage(2).pageNo(1))
          .sort((s) => s.field("text").ascending(false))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join many on many with pagination";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  return (
    <>
      <div>
        <UserPassword></UserPassword>
      </div>
      <div>
        <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
      </div>
      {/* <button type="button" onClick={handleClick}>
        execute
      </button> */}
      <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
    </>
  );
};
