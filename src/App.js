import React, { useState } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import SaveIcon from '@material-ui/icons/Save';
import {
  fileSave,
  supported,
} from 'https://unpkg.com/browser-fs-access';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    textAlign: 'center',
  },
  imgBox: {
    maxWidth: "100%",
    maxHeight: "80%",
    margin: "10px"
  },
  img: {
    height: "inherit",
    maxWidth: "100%",
  },
  input: {
    display: "none"
  }
}));

function App() {
  const classes = useStyles();
  const [source, setSource] = useState("");
  const [img, setImg] = useState("");
  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
          setImg({ uploadedImage: e.target.result });
        };
        reader.readAsDataURL(target.files[0]);
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const onSave = async () => {

    if (supported) {
      console.log('Using the File System Access API.');
    } else {
      console.log('Using the fallback implementation.');
    }

    const blob = dataURItoBlob(img.uploadedImage);
    const file = await fileSave(blob, {
      fileName: document.title + "-" +makeid(5),
      extensions: ['.png'],
      description: 'PNG files',
    });
    if (file) {
      document.title = file.name;
      document.handle = file;
      // updateContext(element);
    }
    // const options = {
    //   types: [
    //     {
    //       description: "Images",
    //       accept: {
    //         "image/png": [".png"],
    //       },
    //       suggestedName: "Capture"
    //     },
    //   ],
    // };

    // const handle = await window.showSaveFilePicker(options);
    // const writable = await handle.createWritable();
    // await writable.write(dataURItoBlob(img.uploadedImage));
    // await writable.close();
    // return handle;
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <h5>Capture your image</h5>
          {source &&
            <Box display="flex" justifyCenter="center" border={1} className={classes.imgBox}>
              <img src={source} alt={"snap"} className={classes.img}></img>
            </Box>
          }
          <input accept="image/*" className={classes.input} id='icon-button-file' type="file" capture="camera" onChange={(e) => handleCapture(e.target)} />
          <label htmlFor='icon-button-file'>
            <IconButton
              color="primary" aria-label="upload picture"
              component="span">
              <PhotoCameraRoundedIcon fontSize="large" color="primary" />
            </IconButton>
          </label>
          {source &&
            <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => onSave()}>
              <SaveIcon fontSize="large" color="secondary" />
            </IconButton>
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
