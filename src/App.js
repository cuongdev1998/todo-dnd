import React, { useState } from 'react';
import './App.scss';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TodoModal } from './components/TodoModal';
import { SVGIcon } from './components/SVGIcon';

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '5px',

  // change background colour if dragging
  background: isDragging ? "#ffffff" : "#ffffff",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#4093e72e" : "#f4f5f6",
  padding: grid,
  width: 250
});

function App() {
  const [state, setState] = useState([getItems(0), getItems(0),getItems(0), getItems(0)]);

  const [openModal, setOpenModal] = useState(false);

  function onDragEnd(result) {
    const { source, destination } = result;
    console.log(result)

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  const generateStatusName = (columnId) => {
    switch (columnId) {
      case 0:
        return {
          label: 'TODO',
          icon: 'todo',
          color: '#000000'
        };
      case 1:
        return {
          label: 'INPROGRESS',
          icon: 'inprogress',
          color: '#2684ff'
        };
      case 2:
        return {
          label: 'PENDING',
          icon: 'pending',
          color: '#fca120'
        };
      case 3:
        return {
          label: 'DONE',
          icon: 'done',
          color: '#4ad395'
        };
      default:
        return {
          label: 'TODO',
          icon: 'todo'
        };
    }
  }
  
  const handleClose = () => {
    setOpenModal(false)
  }

  const handleSubmit = (values) => {
    console.log(values)
       let newArray = [...state];
          newArray[0].push({
            id: `item-${new Date().getTime()}`,
            content: values.trim(),
            status: 'TODO'
        })
          setState(newArray)
  }
  
  
  return (
    <div className="todo-list">
      {openModal ? (
        <TodoModal 
          open={openModal} 
          onClose={handleClose} 
          onSubmit={handleSubmit}
        />
      ) : null}
      <div className="actions">
        {/* <button
          type="button"
          onClick={() => {
            setState([...state, []]);
          }}
        >
          Add new group
        </button> */}
        <button
          type="button"
          className="btn btn-openModal"
          onClick={
            () => {
              setOpenModal(true)
        
          }}
        >
          Add an item
        </button>
      </div>
      <div className="board" style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <div key={ind} className="board__column">
              <SVGIcon name={generateStatusName(ind).icon} color={generateStatusName(ind).color} />

              <div className="board__column--header">{generateStatusName(ind).label}</div>
              <Droppable key={ind} droppableId={`${ind}`}>
              
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {el.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                wordBreak: 'break-word'
                              }}
                            >
                              {item.content}
                              {/* <button
                                type="button"
                                onClick={() => {
                                  const newState = [...state];
                                  newState[ind].splice(index, 1);
                                  setState(
                                    newState.filter(group => group.length)
                                  );
                                }}
                              >
                                delete
                              </button> */}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
