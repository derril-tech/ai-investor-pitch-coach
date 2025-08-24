# Created automatically by Cursor AI (2024-08-24)
from enum import Enum
from typing import Dict, Any, Optional
from datetime import datetime
import uuid


class WorkflowState(Enum):
    """Finite State Machine states for pitch coaching workflow"""
    CREATED = "created"
    DRAFTING = "drafting"
    ASSEMBLING = "assembling"
    REHEARSING = "rehearsing"
    REVIEWING = "reviewing"
    EXPORTED = "exported"
    FAILED = "failed"


class WorkflowTransition:
    """Represents a state transition in the workflow"""
    
    def __init__(self, from_state: WorkflowState, to_state: WorkflowState, condition: Optional[str] = None):
        self.from_state = from_state
        self.to_state = to_state
        self.condition = condition
        self.timestamp = datetime.utcnow()


class WorkflowFSM:
    """Finite State Machine for managing pitch coaching workflow"""
    
    def __init__(self, workflow_id: str):
        self.workflow_id = workflow_id
        self.current_state = WorkflowState.CREATED
        self.transitions: list[WorkflowTransition] = []
        self.metadata: Dict[str, Any] = {}
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def can_transition_to(self, target_state: WorkflowState) -> bool:
        """Check if transition to target state is allowed"""
        valid_transitions = {
            WorkflowState.CREATED: [WorkflowState.DRAFTING, WorkflowState.FAILED],
            WorkflowState.DRAFTING: [WorkflowState.ASSEMBLING, WorkflowState.FAILED],
            WorkflowState.ASSEMBLING: [WorkflowState.REHEARSING, WorkflowState.FAILED],
            WorkflowState.REHEARSING: [WorkflowState.REVIEWING, WorkflowState.FAILED],
            WorkflowState.REVIEWING: [WorkflowState.EXPORTED, WorkflowState.FAILED],
            WorkflowState.EXPORTED: [],
            WorkflowState.FAILED: [],
        }
        
        return target_state in valid_transitions.get(self.current_state, [])
    
    def transition_to(self, target_state: WorkflowState, condition: Optional[str] = None) -> bool:
        """Transition to target state if allowed"""
        if not self.can_transition_to(target_state):
            return False
        
        transition = WorkflowTransition(self.current_state, target_state, condition)
        self.transitions.append(transition)
        self.current_state = target_state
        self.updated_at = datetime.utcnow()
        
        return True
    
    def get_state_info(self) -> Dict[str, Any]:
        """Get current state information"""
        return {
            "workflow_id": self.workflow_id,
            "current_state": self.current_state.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "transitions": [
                {
                    "from": t.from_state.value,
                    "to": t.to_state.value,
                    "condition": t.condition,
                    "timestamp": t.timestamp.isoformat(),
                }
                for t in self.transitions
            ],
            "metadata": self.metadata,
        }
    
    def set_metadata(self, key: str, value: Any) -> None:
        """Set metadata for the workflow"""
        self.metadata[key] = value
        self.updated_at = datetime.utcnow()
    
    def get_metadata(self, key: str, default: Any = None) -> Any:
        """Get metadata for the workflow"""
        return self.metadata.get(key, default)


class WorkflowManager:
    """Manages multiple workflow instances"""
    
    def __init__(self):
        self.workflows: Dict[str, WorkflowFSM] = {}
    
    def create_workflow(self, startup_id: str) -> str:
        """Create a new workflow for a startup"""
        workflow_id = str(uuid.uuid4())
        workflow = WorkflowFSM(workflow_id)
        workflow.set_metadata("startup_id", startup_id)
        self.workflows[workflow_id] = workflow
        return workflow_id
    
    def get_workflow(self, workflow_id: str) -> Optional[WorkflowFSM]:
        """Get workflow by ID"""
        return self.workflows.get(workflow_id)
    
    def transition_workflow(self, workflow_id: str, target_state: WorkflowState, condition: Optional[str] = None) -> bool:
        """Transition workflow to target state"""
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            return False
        return workflow.transition_to(target_state, condition)
    
    def get_workflow_state(self, workflow_id: str) -> Optional[WorkflowState]:
        """Get current state of workflow"""
        workflow = self.get_workflow(workflow_id)
        return workflow.current_state if workflow else None
