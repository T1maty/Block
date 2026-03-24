from pydantic import BaseModel

class TodoBase(BaseModel):
    task:str
    description:str | None = None
    completed:bool | None = None

class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    task: str | None = None
    description: str | None = None
    completed: bool | None = None

class TodoResponse(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True
