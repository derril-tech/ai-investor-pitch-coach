# Created automatically by Cursor AI (2024-08-24)
from pydantic import BaseModel
from typing import Dict, Any, Optional, List


class WorkflowCreate(BaseModel):
    startup_id: str


class WorkflowResponse(BaseModel):
    workflow_id: str
    state: str
    metadata: Dict[str, Any]


class WorkflowStateResponse(BaseModel):
    workflow_id: str
    state: str
    state_info: Dict[str, Any]


class WorkflowTransition(BaseModel):
    from_state: str
    to_state: str
    condition: Optional[str] = None
    timestamp: str


class WorkflowStateInfo(BaseModel):
    workflow_id: str
    current_state: str
    created_at: str
    updated_at: str
    transitions: List[WorkflowTransition]
    metadata: Dict[str, Any]
