import './common/Card.css';
import './common/List.css';

import xvdom from 'xvdom';
import List  from './common/List.jsx';
import User, { CATEGORIES } from '../models/User';
import titlecase from '../helpers/titlecase';

const PAGE_SIZE           = 25;
const ITEM_TYPES          = [ 'bottom', 'shirt', 'sweater', 'businessAttire' ];
const EMPTY_SELECTED_ITEM_IDS = ITEM_TYPES.reduce((obj, type) => ((obj[type] = 0), obj), {});

const isEmptySelection = selectedItems =>
  ITEM_TYPES.reduce((sum, type) => sum + (selectedItems[type] && 1), 0) < 2;

const OutfitRow = ({
  props: { db, outfitId, selectedOutfitId, onSelect, onSetCategory },
  state: { selectedItems },
  bindSend
}) => {
  const outfit     = db.outfits[outfitId];
  const isSelected = outfitId === selectedOutfitId;
  return (
    <div className={`OutfitRow ${isSelected ? 'is-selected' : ''}`}>
      <div className='OutfitRow-items layout horizontal center'>
        {ITEM_TYPES.map(type => {
          const itemId = outfit[type];
          return (
            <span
              className={`OutfitRow-item flex ${selectedItems[type] === itemId ? 'is-selected' : ''}`}
              itemId={itemId}
              itemType={type}
              onclick={bindSend('handleSelectItem')}
              style={`background-image: url(${db.items[itemId].closet_image_url})`}
            />
          );
        })}
      </div>
      {isSelected &&
        <div className="List">
          {/*!isEmptySelection(selectedItems) &&
            <a className="List-item List-item--selection" href="#" onclick={bindSend('handleRemoveCombosWithSelected')}>Remove outfits with these items</a>
          */}
          {CATEGORIES.map(cat =>
            <a
              className="List-item List-item--selection"
              onclick={() => onSetCategory(cat)}
              innerText={titlecase(cat)}
            />
          )}
        </div>
      }
    </div>
  );
};

OutfitRow.state = {
  onInit: ({ props }) => ({
    selectedItems: EMPTY_SELECTED_ITEM_IDS
  }),

  onProps: ({ props: { selectedOutfitId, outfit, outfitId }, state }) => ({
    selectedItems: selectedOutfitId === outfitId ? state.selectedItems : EMPTY_SELECTED_ITEM_IDS
  }),

  handleSelectItem: ({ props, state: { selectedItems } }, { currentTarget }) => {
    const { itemId, itemType } = currentTarget;
    setTimeout(() => props.onSelect(props.outfitId));
    return {
      selectedItems: {
        ...selectedItems,
        [itemType]: selectedItems[itemType] === 0 ? +itemId : 0
      }
    };
  }
};

const renderOutfitListItem = (outfitId, { db, selectedOutfitId, onSelect, onSetCategory }) => ({
  text: (
    <OutfitRow
      db={db}
      outfitId={outfitId}
      selectedOutfitId={selectedOutfitId}
      onSelect={onSelect}
      onSetCategory={onSetCategory}
    />
  )
})

function isUncategorized(outfitId){
  // this === user
  var cat;
  for(var i=0; i<CATEGORIES.length; ++i){
    cat = CATEGORIES[i];
    if(this[cat] && this[cat][outfitId]) return false;
  }
  return true;
}

const firstTen = (outfits, { db, category, user }) => {
  if(category === 'uncategorized') {
    return db.outfitIds.filter(isUncategorized, user).slice(0, PAGE_SIZE);
  }
  return outfits ? Object.keys(outfits) : [];
}

const OutfitList = ({ props: { user, category, db }, state: { selectedOutfitId }, bindSend }) => (
  <List
    className='Card'
    transform={firstTen}
    item={renderOutfitListItem}
    itemClass='List-item--noPadding'
    context={{
      category,
      db,
      user,
      selectedOutfitId,
      onSelect: bindSend('handleSelectOutfit'),
      onSetCategory: bindSend('handleSetCategory')
    }}
    list={user[category]}
  />
);

const onInit = ({ props, state }) => ({ selectedOutfitId: (state && state.selectedOutfitId) || 0 });

OutfitList.state = {
  onInit,
  onProps: onInit,
  handleSelectOutfit: (_, selectedOutfitId) => ({ selectedOutfitId }),
  handleSetCategory: ({ props: { user }, state: { selectedOutfitId } }, cat) => {
    user[cat] = user[cat] || {};
    if(!user[cat][selectedOutfitId]) {
      [...CATEGORIES, 'uncategorized'].forEach(otherCat => {
        if(otherCat === cat) user[otherCat][selectedOutfitId] = 1;
        else if(user[otherCat]){
          let catOutfits = user[otherCat];
          delete catOutfits[selectedOutfitId]
        }
      })
      User.save(user);
    }
    return 0;
  }
}

export default OutfitList;