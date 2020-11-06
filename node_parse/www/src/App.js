import { Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS, autorun } from 'mobx'
import axios from 'axios';
import CompInfo from './components/CompInfo';
import Storage from './storage';

const App = () => {
  const [type, setType] = useState();

  const onClick = function () {
    const file = new FormData(document.form)
    if (document.form.file.files.length) {
      axios
        .post('http://localhost:4000/data', file).then(res => {
          Storage.setXml(res.data[0])
          Storage.setComponents(res.data[1])
          console.log(
            toJS(Storage.xml),
            toJS(Storage.availComponents)
          )
        })
        .catch(err => console.log(err))
    }
  }

  const onChange = function (e) {
    const path = e.target.value;

    const targetPath = path.substring(
      path.lastIndexOf("\\") + 1,
      path.indexOf(".")
    );

    setType(targetPath)
  }

  const postCustomXml = (data) => {
    axios
      .post('http://localhost:4000/generate', {
        fileData: data,
        fileName: type
      })
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  return (
    <Fragment>
      <div className="item">
        <form method="POST" name="form" onChange={(e) => onChange(e)}>
          <input type="file" name="file" id="file"></input>
          <input type="button" onClick={onClick} id="post" value="upload"></input>
        </form>
        <button onClick={() => postCustomXml(toJS(Storage.xml))}>Save</button>
      </div>
      <div id="res">
        {
          Object.keys(Storage.xml).length !== 0 && Storage.xml && (
            Storage.xml.CPedVariationInfo.aComponentData3[0].Item.map((item, index) => (
              <CompInfo key={index} type={Storage.availComponents[index]} xmlCompInfo={Storage.xml.CPedVariationInfo.compInfos[0].Item}/>
            ))
          )
        }
      </div>
    </Fragment>
  )
}

autorun(() => {
  console.log(toJS(Storage.xml))
})

export default observer(App);
