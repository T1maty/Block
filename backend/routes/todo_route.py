from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schema


router = APIRouter()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
# @router.post("/todos/")
# def get_all(db:Session = Depends(get_db)):
#     return db.query(models.Todo).all()


@router.post("/todos/", response_model=schema.TodoResponse, status_code=201)
def create(todo: schema.TodoCreate, db: Session = Depends(get_db)):
    new_todo = models.Todo(task=todo.task, description=todo.description)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo




@router.get("/todos/{todo_id}")
def get_todo(todo_id: int, db:Session = Depends(get_db)):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


@router.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo_update: schema.TodoUpdate, db:Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        for key, value in todo_update.dict().items():
            setattr(todo, key, value)
        db.commit()
        db.refresh(todo)
    return todo

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db:Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return todo