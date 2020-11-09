/* eslint-disable eqeqeq */
import { Fragment  } from 'react';
import { Grid, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ItemDetail from "../components/ItemDetail";
import { observer } from 'mobx-react';
import { toJS } from 'mobx'
import Storage from '../storage';

const CompInfo = (props) => {
  const { type, xmlCompInfo } = props;

  const createGroup = (itemsArray) => {
    const dict = {};

    const model = (item) => item.localDrawableIndex[0].$.value;

    itemsArray.forEach(item => {
      const key = model(item);

      if (!dict[key]) {
        dict[key] = [];
      }

      dict[key].push(item);
    })

    return dict;
  };

  const onClickHandler = (e) => {
    e.preventDefault();

    const formData = document.newItem;
    const numOfNewItems = parseInt(formData.textures.value, 10);

    for (let i = 0; i < numOfNewItems; i++) {
      const itemBlank = { ...toJS(Storage.itemXml) };

      const localDrawableIndex = formData.localDrawableIndex.value;
      const eCompType = formData.eCompType.value;
      const textureIndex = i;
      const lockHash = 'CUSTOM';
      const textLabel = formData.textLabel.value

      itemBlank.localDrawableIndex[0].$.value = localDrawableIndex;
      itemBlank.eCompType[0] = eCompType;
      itemBlank.textureIndex[0].$.value = textureIndex
      itemBlank.lockHash[0] = lockHash;
      itemBlank.textLabel[0] = `${textLabel}_${i}`;
      itemBlank.uniqNameHash[0] = `${textLabel}_${type.toUpperCase()}_${i}`;

      Storage.createItem(itemBlank);
    }
  }

  const groups = createGroup(xmlCompInfo);
  const maxModel = Math.max(...Object.keys(groups))

  return (
    <Fragment>
      <div className="comp-info">
        <p>Type: {type}</p>
        {
          Object.entries(groups).map(([key, item]) => (
            <Accordion key={key}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${key}a-content`}
                id={`panel${key}a-header`}
              >
                <Typography>Item: { key }</Typography>
              </AccordionSummary>
              {item.map((subitem, subindex) => (
                <AccordionDetails key={subindex}>
                  <ItemDetail item={subitem} />
                </AccordionDetails>
              ))}
            </Accordion>
          ))
        }
        <Box m={1}>
          <div>Constructor</div>
          <div>Next model: {maxModel + 1}</div>
          <form name="newItem">
            <Grid container spacing={1}>
              <Grid item xs>
                <label htmlFor="textures">
                  Set textures count: <input id="textures" type="number" name="textures"></input>
                </label>
              </Grid>
              <Grid item xs>
                <label htmlFor="uniqueNameHash">
                  Set name <input id="textLabel" type="text" name="textLabel"></input>
                </label>
                </Grid>
              <input type="hidden" value={maxModel+1} id="localDrawableIndex" name="localDrawableIndex"></input>
              <input type="hidden" value={`PV_COMP_${type.toUpperCase()}`} id="eCompType" name="eCompType"></input>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" component="span" onClick={(e) => onClickHandler(e)}>
                  Create new Item
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
    </Fragment>
  )
}

export default observer(CompInfo);
