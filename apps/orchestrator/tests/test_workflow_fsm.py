# Created automatically by Cursor AI (2024-08-24)
import pytest
from unittest.mock import Mock, patch
from apps.orchestrator.src.core.fsm import WorkflowState, WorkflowFSM, WorkflowManager

class TestWorkflowFSM:
    def setup_method(self):
        self.fsm = WorkflowFSM("test-workflow-1")
    
    def test_initial_state(self):
        """Test that FSM starts in CREATED state"""
        assert self.fsm.current_state == WorkflowState.CREATED
    
    def test_valid_transitions(self):
        """Test valid state transitions"""
        # CREATED -> DRAFTING
        assert self.fsm.can_transition_to(WorkflowState.DRAFTING)
        self.fsm.transition_to(WorkflowState.DRAFTING)
        assert self.fsm.current_state == WorkflowState.DRAFTING
        
        # DRAFTING -> ASSEMBLING
        assert self.fsm.can_transition_to(WorkflowState.ASSEMBLING)
        self.fsm.transition_to(WorkflowState.ASSEMBLING)
        assert self.fsm.current_state == WorkflowState.ASSEMBLING
        
        # ASSEMBLING -> REHEARSING
        assert self.fsm.can_transition_to(WorkflowState.REHEARSING)
        self.fsm.transition_to(WorkflowState.REHEARSING)
        assert self.fsm.current_state == WorkflowState.REHEARSING
        
        # REHEARSING -> REVIEWING
        assert self.fsm.can_transition_to(WorkflowState.REVIEWING)
        self.fsm.transition_to(WorkflowState.REVIEWING)
        assert self.fsm.current_state == WorkflowState.REVIEWING
        
        # REVIEWING -> EXPORTED
        assert self.fsm.can_transition_to(WorkflowState.EXPORTED)
        self.fsm.transition_to(WorkflowState.EXPORTED)
        assert self.fsm.current_state == WorkflowState.EXPORTED
    
    def test_invalid_transitions(self):
        """Test invalid state transitions"""
        # Cannot go directly from CREATED to EXPORTED
        assert not self.fsm.can_transition_to(WorkflowState.EXPORTED)
        
        # Cannot go from CREATED to REVIEWING
        assert not self.fsm.can_transition_to(WorkflowState.REVIEWING)
        
        # Cannot go backwards from DRAFTING to CREATED
        self.fsm.transition_to(WorkflowState.DRAFTING)
        assert not self.fsm.can_transition_to(WorkflowState.CREATED)
    
    def test_failed_state(self):
        """Test transition to FAILED state from any state"""
        # Can fail from CREATED
        assert self.fsm.can_transition_to(WorkflowState.FAILED)
        self.fsm.transition_to(WorkflowState.FAILED)
        assert self.fsm.current_state == WorkflowState.FAILED
        
        # Reset and test from DRAFTING
        self.fsm = WorkflowFSM("test-workflow-2")
        self.fsm.transition_to(WorkflowState.DRAFTING)
        assert self.fsm.can_transition_to(WorkflowState.FAILED)
        self.fsm.transition_to(WorkflowState.FAILED)
        assert self.fsm.current_state == WorkflowState.FAILED
    
    def test_metadata_operations(self):
        """Test metadata get/set operations"""
        # Set metadata
        self.fsm.set_metadata("narrative_id", "narr-123")
        self.fsm.set_metadata("user_id", "user-456")
        
        # Get metadata
        assert self.fsm.get_metadata("narrative_id") == "narr-123"
        assert self.fsm.get_metadata("user_id") == "user-456"
        assert self.fsm.get_metadata("nonexistent") is None
    
    def test_state_info(self):
        """Test getting state information"""
        info = self.fsm.get_state_info()
        assert info["current_state"] == WorkflowState.CREATED
        assert info["workflow_id"] == "test-workflow-1"
        assert "created_at" in info
        assert "updated_at" in info
        assert "metadata" in info

class TestWorkflowManager:
    def setup_method(self):
        self.manager = WorkflowManager()
    
    def test_create_workflow(self):
        """Test creating a new workflow"""
        workflow_id = self.manager.create_workflow("test-workflow-1")
        assert workflow_id == "test-workflow-1"
        assert workflow_id in self.manager.workflows
    
    def test_get_workflow(self):
        """Test getting an existing workflow"""
        workflow_id = self.manager.create_workflow("test-workflow-1")
        workflow = self.manager.get_workflow(workflow_id)
        assert workflow is not None
        assert workflow.workflow_id == workflow_id
    
    def test_get_nonexistent_workflow(self):
        """Test getting a workflow that doesn't exist"""
        workflow = self.manager.get_workflow("nonexistent")
        assert workflow is None
    
    def test_list_workflows(self):
        """Test listing all workflows"""
        self.manager.create_workflow("workflow-1")
        self.manager.create_workflow("workflow-2")
        self.manager.create_workflow("workflow-3")
        
        workflows = self.manager.list_workflows()
        assert len(workflows) == 3
        assert "workflow-1" in workflows
        assert "workflow-2" in workflows
        assert "workflow-3" in workflows
    
    def test_delete_workflow(self):
        """Test deleting a workflow"""
        workflow_id = self.manager.create_workflow("test-workflow-1")
        assert workflow_id in self.manager.workflows
        
        self.manager.delete_workflow(workflow_id)
        assert workflow_id not in self.manager.workflows
    
    def test_workflow_state_transitions(self):
        """Test workflow state transitions through manager"""
        workflow_id = self.manager.create_workflow("test-workflow-1")
        workflow = self.manager.get_workflow(workflow_id)
        
        # Test state transitions
        workflow.transition_to(WorkflowState.DRAFTING)
        assert workflow.current_state == WorkflowState.DRAFTING
        
        workflow.transition_to(WorkflowState.ASSEMBLING)
        assert workflow.current_state == WorkflowState.ASSEMBLING

class TestWorkflowState:
    def test_state_enum_values(self):
        """Test that all expected states exist"""
        assert WorkflowState.CREATED == "CREATED"
        assert WorkflowState.DRAFTING == "DRAFTING"
        assert WorkflowState.ASSEMBLING == "ASSEMBLING"
        assert WorkflowState.REHEARSING == "REHEARSING"
        assert WorkflowState.REVIEWING == "REVIEWING"
        assert WorkflowState.EXPORTED == "EXPORTED"
        assert WorkflowState.FAILED == "FAILED"
    
    def test_state_enum_membership(self):
        """Test state enum membership"""
        assert "CREATED" in WorkflowState
        assert "DRAFTING" in WorkflowState
        assert "ASSEMBLING" in WorkflowState
        assert "REHEARSING" in WorkflowState
        assert "REVIEWING" in WorkflowState
        assert "EXPORTED" in WorkflowState
        assert "FAILED" in WorkflowState
        assert "INVALID_STATE" not in WorkflowState

if __name__ == "__main__":
    pytest.main([__file__])
