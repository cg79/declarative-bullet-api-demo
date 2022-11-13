import {
  BULLET_METHOD,
  STORAGE_PROVIDER,
  IFileStatus,
} from "declarative-fluent-bullet-api/fluent/constants";
import { Component, createRef, useCallback, useEffect, useState } from "react";
import {
  createDeclarativeBulletApi,
  loginBulletIO_01,
} from "../_factory/prerequisites";
import { utils } from "../_utils/utils";
import { store } from "../_store/store";
import { BulletLogsComponent } from "../_components/bullet-logs-component";
import BulletLog from "../_models/BulletLog";
import { helpers } from "../_utils/helpers";
import BulletFile from "declarative-fluent-bullet-api/BulletFile";
import { UserPassword } from "../user/user-password";

// 1. navigagte to https://cloud.google.com/storage/docs/creating-buckets
// 2. press the "Create Bucket" button
// 3. set the bucket permission. for this example the public access is allowed
// 4. navigate to  https://cloud.google.com/iam/docs/creating-managing-service-account-keys
// 5. go to service accounts and select your project
// 6. click on KEYS tab and click on "CREATE KEY"
// 7. edit the bullet key and set the new downloaded google bullet json file and press save

const EVENT_NANME = "INSERT_FILES";

export class DemoInsertFiles extends Component<{}, { [key: string]: any }> {
  boxRef1: any;
  boxRef2: any;
  boxRef3: any;
  constructor(props: any) {
    super(props);

    this.state = {
      error: "",
    };
    this.boxRef1 = createRef();
    this.boxRef2 = createRef();
    this.boxRef3 = createRef();

    this.onConstructor();

    // this.loadLocalFiles();
  }

  componentDidUpdate(prevProps: any, prevState: any) {}

  onConstructor() {
    const list: any[] = [];

    const b1 = new BulletLog({
      title: "Insert Files into local server",
      description: `
      const files: BulletFile[] = [];
      const cFile1 = cloneBulletFile(file1);
      cFile1.status = IFileStatus.AddedFile;

      const cFile2 = cloneBulletFile(file2);
      cFile2.status = IFileStatus.AddedFile;

      files.push(cFile1);
      files.push(cFile2);

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
        .storage((s) =>
          s.bucket("claudiudeclarativeapibucket").provider(storageProvider).addFiles(files)
        )
        .execute()
      `,
    });
    b1.func = () => {
      this.insertFiles(STORAGE_PROVIDER.LOCAL, "insert1", b1);
    };
    list.push(b1);

    const b2 = new BulletLog({
      title: "Insert Files into google bucket",
      description: `
      const files: BulletFile[] = [];
      const cFile1 = cloneBulletFile(file1);
      cFile1.status = IFileStatus.AddedFile;

      const cFile2 = cloneBulletFile(file2);
      cFile2.status = IFileStatus.AddedFile;

      files.push(cFile1);
      files.push(cFile2);

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
        .storage((s) =>
          s.bucket("claudiudeclarativeapibucket").provider(storageProvider).addFiles(files)
        )
        .execute()
      `,
    });
    b2.func = () =>
      this.insertFiles(
        STORAGE_PROVIDER.GOOGLE,
        "claudiudeclarativeapibucket",
        b2
      );
    list.push(b2);

    const namedFilesLocal = this.createNamedFilesAction(
      STORAGE_PROVIDER.LOCAL,
      "Insert named files into local server"
    );
    list.push(namedFilesLocal);

    const namedFilesGoogleBucket = this.createNamedFilesAction(
      STORAGE_PROVIDER.GOOGLE,
      "Insert named files into google bucket "
    );
    list.push(namedFilesGoogleBucket);

    const namedFilesLocalLinked = this.createInsertNamedFilesLinkedCollection(
      STORAGE_PROVIDER.LOCAL,
      "Insert named files into local server"
    );
    list.push(namedFilesLocalLinked);

    const namedFilesGoogleBucketLinked =
      this.createInsertNamedFilesLinkedCollection(
        STORAGE_PROVIDER.GOOGLE,
        "Insert named files into google bucket "
      );
    list.push(namedFilesGoogleBucketLinked);

    const adddel1 = this.createInsertFiles_DeleteOneAddOne(
      STORAGE_PROVIDER.LOCAL,
      "local files --> delete one + add new one"
    );
    list.push(adddel1);

    const adddel2 = this.createInsertFiles_DeleteOneAddOne(
      STORAGE_PROVIDER.GOOGLE,
      "google bucket files --> delete one + add new one"
    );
    list.push(adddel2);

    const adddel3 = this.createinsertFiles_DeleteOneAddOne_LinkedCollection(
      STORAGE_PROVIDER.LOCAL,
      "local files --> delete one + add new one (linked collection)"
    );
    list.push(adddel3);

    const adddel4 = this.createinsertFiles_DeleteOneAddOne_LinkedCollection(
      STORAGE_PROVIDER.GOOGLE,
      "google bucket files --> delete one + add new one (linked collection)"
    );
    list.push(adddel4);

    //
    store.push(EVENT_NANME, list, true);

    // setList(list);
  }

  checkPrerequisites = async () => {
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    if (!this.state.file1 || !this.state.file2 || !this.state.file3) {
      //setErrror("please provide file1 or file2 or file3");
      return;
    }
    // setErrror("");
  };

  insertFiles = async (
    storageProvider: STORAGE_PROVIDER,
    collectionName: string,
    bulletLog: BulletLog
  ) => {
    await this.checkPrerequisites();

    const files: BulletFile[] = [];

    const cFile1 = this.cloneBulletFile(this.state.file1);
    if (cFile1) {
      cFile1.status = IFileStatus.AddedFile;
      files.push(cFile1);
    }

    const cFile2 = this.cloneBulletFile(this.state.file2);
    if (cFile2) {
      cFile2.status = IFileStatus.AddedFile;
      files.push(cFile2);
    }

    const insertUpdateGuid = utils.createUUID();

    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s
          .bucket("claudiudeclarativeapibucket")
          .provider(storageProvider)
          .addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;
    // bulletLog.description = `
    // const findResponse = await createDeclarativeBulletApi()
    // .body({ guid: insertUpdateGuid })
    // .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
    // .execute({
    //   beforeSendingRequest: (apiBulletJSON: any) => {
    //     vRequest = apiBulletJSON;
    //   },
    // })
    // `;
  };

  insertNamedFiles = async (
    storageProvider: STORAGE_PROVIDER,
    collectionName: string,
    bulletLog: BulletLog
  ) => {
    await this.checkPrerequisites();

    if (this.state.file1) {
      this.state.file1.name = "file1.png";
    }

    if (this.state.file2) {
      this.state.file2.name = "file2.png";
    }

    const files: BulletFile[] = [];

    const cFile1 = this.cloneBulletFile(this.state.file1);
    if (cFile1) {
      cFile1.name = "ffffftest.png";
      cFile1.status = IFileStatus.AddedFile;
      files.push(cFile1);
    }

    const cFile2 = this.cloneBulletFile(this.state.file2);
    if (cFile2) {
      cFile2.status = IFileStatus.AddedFile;
      files.push(cFile2);
    }

    const insertUpdateGuid = utils.createUUID();

    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s
          .bucket("claudiudeclarativeapibucket")
          .provider(storageProvider)
          .addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;
    bulletLog.title = "insert example 1";
    bulletLog.description = `
    const findResponse = await createDeclarativeBulletApi()
    .body({ guid: insertUpdateGuid })
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    })
    `;
  };

  createNamedFilesAction(provider: STORAGE_PROVIDER, title = "") {
    const b2 = new BulletLog({
      title: title || "Insert NAMED Files into google bucket or local server",
      description: `
      const files: BulletFile[] = [];
      if (this.state.file1) {
        this.state.file1.name = "file1.png";
        files.push(this.state.file1);
      }

      if (this.state.file2) {
        this.state.file2.name = "file2.png";
        files.push(this.state.file2);
      }

      const insertUpdateGuid = utils.createUUID();

      let apiBulletRequest = null;

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
        .storage((s) =>
            s.bucket("claudiudeclarativeapibucket")
            .provider(storageProvider)
            .addFiles(files)
            .collection((c) => c.name("linkedfiles1"))
        )
        .execute()
      `,
    });
    b2.func = () =>
      this.insertNamedFiles(provider, "claudiudeclarativeapibucket", b2);

    return b2;
  }

  insertNamedFilesLinkedCollection = async (
    storageProvider: STORAGE_PROVIDER,
    collectionName: string,
    bulletLog: BulletLog
  ) => {
    await this.checkPrerequisites();

    const files: BulletFile[] = [];
    if (this.state.file1) {
      this.state.file1.name = "file1.png";
      files.push(this.state.file1);
    }

    if (this.state.file2) {
      this.state.file2.name = "file2.png";
      files.push(this.state.file2);
    }

    const insertUpdateGuid = utils.createUUID();

    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s
          .bucket("claudiudeclarativeapibucket")
          .provider(storageProvider)
          .addFiles(files)
          .collection((c) => c.name("linkedfiles1"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;
    bulletLog.title = "insert example 1";
    bulletLog.description = `
    const findResponse = await createDeclarativeBulletApi()
    .body({ guid: insertUpdateGuid })
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    })
    `;
  };

  createInsertNamedFilesLinkedCollection(
    provider: STORAGE_PROVIDER,
    title = ""
  ) {
    const b2 = new BulletLog({
      title: title || "Insert NAMED Files into google bucket or local server",
      description: `
      const files: BulletFile[] = [];
      if (this.state.file1) {
        this.state.file1.name = "file1.png";
        files.push(this.state.file1);
      }

      if (this.state.file2) {
        this.state.file2.name = "file2.png";
        files.push(this.state.file2);
      }

      const insertUpdateGuid = utils.createUUID();

      let apiBulletRequest = null;

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
        .storage((s) =>
            s.bucket("claudiudeclarativeapibucket")
            .provider(storageProvider)
            .addFiles(files)
            .collection((c) => c.name("linkedfiles1"))
        )
        .execute()
      `,
    });
    b2.func = () =>
      this.insertNamedFilesLinkedCollection(
        provider,
        "claudiudeclarativeapibucket",
        b2
      );

    return b2;
  }

  insertFiles_DeleteOneAddOne = async (
    storageProvider: STORAGE_PROVIDER,
    collectionName: string,
    bulletLog: BulletLog
  ) => {
    await this.checkPrerequisites();

    const files: BulletFile[] = [];

    const cFile1 = this.cloneBulletFile(this.state.file1);
    cFile1.status = IFileStatus.AddedFile;
    files.push(cFile1);

    const cFile2 = this.cloneBulletFile(this.state.file2);
    cFile2.status = IFileStatus.DeletedFile;
    files.push(cFile2);

    const insertUpdateGuid = utils.createUUID();

    let apiBulletRequest = null;

    const bucketName = "claudiudeclarativeapibucket";
    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s.bucket(bucketName).provider(storageProvider).addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;

    bulletLog.description = `
    
    `;

    // let's delete one file

    cFile1.status = IFileStatus.ExistentFile;

    cFile2.bucket = bucketName;
    cFile2.originalFileName = cFile2.nameValue;
    cFile2.status = IFileStatus.DeletedFile;

    const cFile3 = this.cloneBulletFile(this.state.file3);
    cFile3.status = IFileStatus.AddedFile;
    files.push(cFile3);

    let deleteRequest = null;
    const deleteResponse = await createDeclarativeBulletApi()
      .body({ test: 2, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.UPDATE_ONE))
      .storage((s) =>
        s
          .bucket("claudiudeclarativeapibucket")
          .provider(storageProvider)
          .addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          deleteRequest = apiBulletJSON;
        },
      });

    let findRequest1 = null;
    const findResponse1 = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          findRequest1 = apiBulletJSON;
        },
      });

    const bulletLogVerify1: BulletLog = new BulletLog({});
    bulletLogVerify1.route = "insert1-verify";
    bulletLogVerify1.request = findRequest1;
    bulletLogVerify1.response = findResponse1;

    const bulletLog1: BulletLog = new BulletLog({});
    bulletLog1.route = "insert1";
    bulletLog1.request = deleteRequest;
    bulletLog1.response = deleteResponse;
    bulletLog1.verify = bulletLogVerify1;
    bulletLog1.title = "delete file 2 and add file 3";
    bulletLog1.description = `
    //DESCRIPTION
    //delete one file from the local server, under the 'claudiudeclarativeapibucket' directory AND add the third file

    // const files: BulletFile[] = [];
    // const cFile1 = cloneBulletFile(file1);
    // cFile1.status = IFileStatus.ExistentFile;

    // const cFile2 = cloneBulletFile(file2);
    // cFile2.bucket = bucketName;
    // cFile2.originalFileName = cFile2.nameValue;
    // cFile2.status = IFileStatus.DeletedFile;

    // files.push(cFile1);
    // files.push(cFile2);

    // const cFile3 = cloneBulletFile(file3);
    // cFile3.status = IFileStatus.AddedFile;
    // files.push(cFile3);

    

    const deleteResponse = await createDeclarativeBulletApi()
      .body({ test: 2, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.UPDATE_ONE))
      .storage((s) =>
        s.bucket("claudiudeclarativeapibucket").provider(storageProvider).addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          deleteRequest = apiBulletJSON;
        },
      });
    `;
  };

  createInsertFiles_DeleteOneAddOne(provider: STORAGE_PROVIDER, title = "") {
    const b2 = new BulletLog({
      title: title || "Insert NAMED Files into google bucket or local server",
      description: `
      //DESCRIPTION
      //delete one file and add another file, under the 'claudiudeclarativeapibucket' directory

      const files: BulletFile[] = [];

      const cFile1 = this.cloneBulletFile(this.state.file1);
      cFile1.status = IFileStatus.AddedFile;
      files.push(cFile1);

      const cFile2 = this.cloneBulletFile(this.state.file2);
      cFile2.status = IFileStatus.DeletedFile;
      files.push(cFile2);

      const insertUpdateGuid = utils.createUUID();

      let apiBulletRequest = null;

      const bucketName = "claudiudeclarativeapibucket";
      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
        .storage((s) =>
          s.bucket(bucketName).provider(storageProvider).addFiles(files)
        )
        .execute()
      `,
    });
    b2.func = () =>
      this.insertFiles_DeleteOneAddOne(
        provider,
        "claudiudeclarativeapibucket",
        b2
      );

    return b2;
  }

  insertFiles_DeleteOneAddOne_LinkedCollection = async (
    storageProvider: STORAGE_PROVIDER,
    collectionName: string,
    bulletLog: BulletLog
  ) => {
    await this.checkPrerequisites();

    const files: BulletFile[] = [];
    const cFile1 = this.cloneBulletFile(this.state.file1);
    cFile1.status = IFileStatus.AddedFile;

    const cFile2 = this.cloneBulletFile(this.state.file2);
    cFile2.status = IFileStatus.AddedFile;

    files.push(cFile1);
    files.push(cFile2);
    const insertUpdateGuid = utils.createUUID();

    let apiBulletRequest = null;

    const bucketName = "claudiudeclarativeapibucket";
    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s
          .bucket(bucketName)
          .provider(storageProvider)
          .addFiles(files)
          .collection((c) => c.name("my_local_files"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ pidg: insertUpdateGuid }))
      .collection((c) => c.name("my_local_files").method(BULLET_METHOD.FIND))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;
    bulletLog.title = "insert example 1";
    bulletLog.description = `
    //DESCRIPTION
    //insert first 2 files into the local server, under the 'claudiudeclarativeapibucket' directory

    // const bucketName = "claudiudeclarativeapibucket";
    // const files: BulletFile[] = [];
    // const cFile1 = cloneBulletFile(file1);
    // cFile1.status = IFileStatus.AddedFile;

    // const cFile2 = cloneBulletFile(file2);
    // cFile2.status = IFileStatus.AddedFile;

    // files.push(cFile1);
    // files.push(cFile2);

    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s.bucket(bucketName).provider(storageProvider).addFiles(files)
        .collection((c) => c.name("my_local_files"))
      )
      .execute()
    `;

    // let's delete one file

    cFile1.status = IFileStatus.ExistentFile;

    cFile2.bucket = bucketName;
    cFile2.originalFileName = cFile2.nameValue;
    cFile2.status = IFileStatus.DeletedFile;

    const cFile3 = this.cloneBulletFile(this.state.file3);
    cFile3.status = IFileStatus.AddedFile;
    files.push(cFile3);

    let deleteRequest = null;
    const deleteResponse = await createDeclarativeBulletApi()
      .body({ test: 3, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.UPDATE_ONE))
      .storage((s) =>
        s
          .bucket("claudiudeclarativeapibucket")
          .provider(storageProvider)
          .addFiles(files)
          .collection((c) => c.name("my_local_files"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          deleteRequest = apiBulletJSON;
        },
      });

    let findRequest1 = null;
    const findResponse1 = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ pidg: insertUpdateGuid }))
      .collection((c) => c.name("my_local_files").method(BULLET_METHOD.FIND))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          findRequest1 = apiBulletJSON;
        },
      });

    const bulletLogVerify1: BulletLog = new BulletLog({});
    bulletLogVerify1.route = "insert1-verify";
    bulletLogVerify1.request = findRequest1;
    bulletLogVerify1.response = findResponse1;

    const bulletLog1: BulletLog = new BulletLog({});
    bulletLog1.route = "insert1";
    bulletLog1.request = deleteRequest;
    bulletLog1.response = deleteResponse;
    bulletLog1.verify = bulletLogVerify1;
    bulletLog1.title = "delete file 2 and add file 3";
    bulletLog1.description = `
    //DESCRIPTION
    //delete one file from the local server, under the 'claudiudeclarativeapibucket' directory AND add the third file

    // const files: BulletFile[] = [];
    // const cFile1 = cloneBulletFile(file1);
    // cFile1.status = IFileStatus.ExistentFile;

    // const cFile2 = cloneBulletFile(file2);
    // cFile2.bucket = bucketName;
    // cFile2.originalFileName = cFile2.nameValue;
    // cFile2.status = IFileStatus.DeletedFile;

    // files.push(cFile1);
    // files.push(cFile2);

    // const cFile3 = cloneBulletFile(file3);
    // cFile3.status = IFileStatus.AddedFile;
    // files.push(cFile3);

    

    const deleteResponse = await createDeclarativeBulletApi()
      .body({ test: 2, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.UPDATE_ONE))
      .storage((s) =>
        s.bucket("claudiudeclarativeapibucket").provider(storageProvider).addFiles(files)
        .collection((c) => c.name("my_local_files"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          deleteRequest = apiBulletJSON;
        },
      });
    `;
  };

  createinsertFiles_DeleteOneAddOne_LinkedCollection(
    provider: STORAGE_PROVIDER,
    title = ""
  ) {
    const b2 = new BulletLog({
      title: title || "Insert NAMED Files into google bucket or local server",
      description: `
      const files: BulletFile[] = [];
      const cFile1 = cloneBulletFile(file1);
      cFile1.status = IFileStatus.AddedFile;

      const cFile2 = cloneBulletFile(file2);
      cFile2.status = IFileStatus.AddedFile;

      files.push(cFile1);
      files.push(cFile2);

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid: insertUpdateGuid })
        .collection((c) => c.name(collectionName).method(BULLET_METHOD.INSERT))
        .storage((s) =>
          s.bucket("claudiudeclarativeapibucket").provider(storageProvider).addFiles(files)
        )
        .execute()
      `,
    });
    b2.func = () =>
      this.insertFiles_DeleteOneAddOne_LinkedCollection(
        provider,
        "claudiudeclarativeapibucket",
        b2
      );

    return b2;
  }

  insertFilesOnGoogleBucket = async (bulletLog: BulletLog) => {
    await this.checkPrerequisites();

    const files: BulletFile[] = [];
    if (this.state.file1) {
      this.state.file1.name = "file1.png";
      files.push(this.state.file1);
    }

    if (this.state.file2) {
      this.state.file2.name = "file2.png";
      files.push(this.state.file2);
    }

    const insertUpdateGuid = utils.createUUID();
    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
      .storage((s) =>
        s
          .bucket("bucket_bullet_api")
          .provider(STORAGE_PROVIDER.GOOGLE)
          .addFiles(files)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: insertUpdateGuid })
      .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;
    bulletLog.title = "insert example 1";
    bulletLog.description = `
    1. create google cloud bucket: https://cloud.google.com/storage/docs/creating-buckets
    2. navigate to  https://cloud.google.com/iam/docs/creating-managing-service-account-keys, click on ... --> manage keys
    3. edit the bullet key and set the new downloaded google bullet json file and press save

    const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    })
    `;
  };

  loadLocalFiles() {
    this.loadURLToInputFiled(
      "http://localhost:3006/images/one.jpeg",
      this.boxRef1
    );
  }

  onFileChange1 = (event: any) => {
    const fileValue = new BulletFile({
      fileContent: event.target.files[0],
    });
    if (!fileValue) {
      throw new Error("file empty");
    }

    this.setState({ file1: fileValue });
  };

  onFileChange2 = (event: any) => {
    const fileValue = new BulletFile({
      fileContent: event.target.files[0],
    });
    if (!fileValue) {
      throw new Error("file empty");
    }
    this.setState({ file2: fileValue });
  };

  onFileChange3 = (event: any) => {
    const fileValue = new BulletFile({
      fileContent: event.target.files[0],
    });
    if (!fileValue) {
      throw new Error("file empty");
    }
    this.setState({ file3: fileValue });
  };

  cloneBulletFile = (bf: BulletFile | undefined) => {
    if (!bf) {
      throw new Error("no bullet file to clone");
    }
    const resp = new BulletFile(bf);
    return resp;
  };

  loadURLToInputFiled(url: string, refElement: any) {
    helpers.getBlobFromUrl(url, (imgBlob: Blob) => {
      // Load img blob to input
      // WIP: UTF8 character error
      let fileName = "hasFilename.jpg";
      let file = new File([imgBlob], fileName, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      let container = new DataTransfer();
      container.items.add(file);

      //const fileHtml = document.querySelector(fileId) as HTMLInputElement;
      // if (!fileHtml) {
      //   throw new Error(`${fileId} not found`);
      // }
      refElement.current["files"] = container.files;
    });
  }

  render() {
    return (
      <>
        <div>
          <UserPassword></UserPassword>
        </div>
        <div>
          <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
        </div>

        <div>
          <input
            type="file"
            id="htmlfile1"
            ref={this.boxRef1}
            onChange={this.onFileChange1}
          />
        </div>
        <div>
          <input
            type="file"
            id="htmlfile2"
            ref={this.boxRef2}
            onChange={this.onFileChange2}
          />
        </div>
        <div>
          <input
            type="file"
            id="htmlfile3"
            ref={this.boxRef3}
            onChange={this.onFileChange3}
          />
        </div>

        {this.state.error && <div className="error">{this.state.error}</div>}
        <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
      </>
    );
  }
}
