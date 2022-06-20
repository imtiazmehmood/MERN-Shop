// Index.html
<div>
  <h1>File upload</h1>
  <input type="file" multiple onChange={(e) => uploadFile(e)} />
</div>;

// Index.js
const uploadFile = async (e) => {
  const files = e.target.files;
  console.log("files", files);
  const form = new FormData();
  for (let i = 0; i < files.length; i++) {
    form.append("files", files[i], files[i].name);
  }
  try {
    let request = await fetch("/upload", {
      method: "post",
      body: form,
    });
    const response = await request.json();
    console.log("Response", response);
  } catch (err) {
    alert("Error uploading the files");
    console.log("Error uploading the files", err);
  }
};

// Server.js
const Formidable = require("formidable");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));

// Server.js
// Returns true if successful or false otherwise
async function checkCreateUploadsFolder(uploadsFolder) {
  try {
    await fs.statAsync(uploadsFolder);
  } catch (e) {
    if (e && e.code == "ENOENT") {
      console.log("The uploads folder doesn't exist, creating a new one...");
      try {
        await fs.mkdirAsync(uploadsFolder);
      } catch (err) {
        console.log("Error creating the uploads folder 1");
        return false;
      }
    } else {
      console.log("Error creating the uploads folder 2");
      return false;
    }
  }
  return true;
}

// Returns true or false depending on whether the file is an accepted type
function checkAcceptedExtensions(file) {
  const type = file.type.split("/").pop();
  const accepted = ["jpeg", "jpg", "png", "gif", "pdf"];
  if (accepted.indexOf(type) == -1) {
    return false;
  }
  return true;
}

app.post("/upload", async (req, res) => {
  let form = Formidable.IncomingForm();
  const uploadsFolder = join(__dirname, "dist", "uploads");
  form.multiples = true;
  form.uploadDir = uploadsFolder;
  form.maxFileSize = 50 * 1024 * 1024; // 50 MB
  const folderCreationResult = await checkCreateUploadsFolder(uploadsFolder);
  if (!folderCreationResult) {
    return res.json({
      ok: false,
      msg: "The uploads folder couldn't be created",
    });
  }
  form.parse(req, async (err, fields, files) => {
    let myUploadedFiles = [];
    if (err) {
      console.log("Error parsing the incoming form");
      return res.json({ ok: false, msg: "Error passing the incoming form" });
    }
    // If we are sending only one file:
    if (!files.files.length) {
      const file = files.files;
      if (!checkAcceptedExtensions(file)) {
        console.log("The received file is not a valid type");
        return res.json({
          ok: false,
          msg: "The sent file is not a valid type",
        });
      }
      const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, "-"));
      myUploadedFiles.push(fileName);
      try {
        await fs.renameAsync(file.path, join(uploadsFolder, fileName));
      } catch (e) {
        console.log("Error uploading the file");
        try {
          await fs.unlinkAsync(file.path);
        } catch (e) {}
        return res.json({ ok: false, msg: "Error uploading the file" });
      }
    } else {
      for (let i = 0; i < files.files.length; i++) {
        const file = files.files[i];
        if (!checkAcceptedExtensions(file)) {
          console.log("The received file is not a valid type");
          return res.json({
            ok: false,
            msg: "The sent file is not a valid type",
          });
        }
        const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, "-"));
        myUploadedFiles.push(fileName);
        try {
          await fs.renameAsync(file.path, join(uploadsFolder, fileName));
        } catch (e) {
          console.log("Error uploading the file");
          try {
            await fs.unlinkAsync(file.path);
          } catch (e) {}
          return res.json({ ok: false, msg: "Error uploading the file" });
        }
      }
    }
    res.json({
      ok: true,
      msg: "Files uploaded succesfully!",
      files: myUploadedFiles,
    });
  });
});
