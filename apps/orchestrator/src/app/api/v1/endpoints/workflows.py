# Created automatically by Cursor AI (2024-08-24)
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
from app.core.fsm import WorkflowManager, WorkflowState
from app.core.agents import CrewManager
from app.schemas.workflow import WorkflowCreate, WorkflowResponse, WorkflowStateResponse

router = APIRouter()

# Global instances (in production, these would be dependency injected)
workflow_manager = WorkflowManager()
crew_manager = CrewManager()


@router.post("/workflows", response_model=WorkflowResponse)
async def create_workflow(workflow_data: WorkflowCreate):
    """Create a new workflow for a startup"""
    try:
        workflow_id = workflow_manager.create_workflow(workflow_data.startup_id)
        workflow = workflow_manager.get_workflow(workflow_id)
        
        return WorkflowResponse(
            workflow_id=workflow_id,
            state=workflow.current_state.value,
            metadata=workflow.metadata
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create workflow: {str(e)}")


@router.get("/workflows/{workflow_id}", response_model=WorkflowStateResponse)
async def get_workflow_state(workflow_id: str):
    """Get the current state of a workflow"""
    workflow = workflow_manager.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return WorkflowStateResponse(
        workflow_id=workflow_id,
        state=workflow.current_state.value,
        state_info=workflow.get_state_info()
    )


@router.post("/workflows/{workflow_id}/transition")
async def transition_workflow(
    workflow_id: str, 
    target_state: str, 
    background_tasks: BackgroundTasks
):
    """Transition workflow to a new state"""
    try:
        target_workflow_state = WorkflowState(target_state)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid state: {target_state}")
    
    workflow = workflow_manager.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    if not workflow_manager.transition_workflow(workflow_id, target_workflow_state):
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot transition from {workflow.current_state.value} to {target_state}"
        )
    
    # If transitioning to drafting, start the narrative generation process
    if target_workflow_state == WorkflowState.DRAFTING:
        background_tasks.add_task(start_narrative_generation, workflow_id)
    
    return {"message": f"Workflow transitioned to {target_state}"}


@router.post("/workflows/{workflow_id}/narrative/generate")
async def generate_narrative(workflow_id: str, startup_data: Dict[str, Any]):
    """Generate narrative for a startup"""
    workflow = workflow_manager.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    try:
        # Create narrative crew
        crew = crew_manager.create_narrative_crew(startup_data)
        
        # Execute the crew
        result = crew.kickoff()
        
        # Update workflow metadata
        workflow.set_metadata("narrative", result)
        workflow_manager.transition_workflow(workflow_id, WorkflowState.ASSEMBLING)
        
        return {
            "workflow_id": workflow_id,
            "narrative": result,
            "status": "completed"
        }
    except Exception as e:
        workflow_manager.transition_workflow(workflow_id, WorkflowState.FAILED)
        raise HTTPException(status_code=500, detail=f"Narrative generation failed: {str(e)}")


@router.post("/workflows/{workflow_id}/analysis/run")
async def run_analysis(workflow_id: str, analysis_data: Dict[str, Any]):
    """Run comprehensive analysis"""
    workflow = workflow_manager.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    try:
        # Create analysis crew
        crew = crew_manager.create_analysis_crew(analysis_data)
        
        # Execute the crew
        result = crew.kickoff()
        
        # Update workflow metadata
        workflow.set_metadata("analysis", result)
        
        return {
            "workflow_id": workflow_id,
            "analysis": result,
            "status": "completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/workflows/{workflow_id}/qa/generate")
async def generate_qa(workflow_id: str, narrative: str):
    """Generate Q&A questions"""
    workflow = workflow_manager.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    try:
        # Create Q&A crew
        crew = crew_manager.create_qa_crew(narrative)
        
        # Execute the crew
        result = crew.kickoff()
        
        # Update workflow metadata
        workflow.set_metadata("qa_questions", result)
        
        return {
            "workflow_id": workflow_id,
            "qa_questions": result,
            "status": "completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Q&A generation failed: {str(e)}")


async def start_narrative_generation(workflow_id: str):
    """Background task to start narrative generation"""
    # This would be implemented to start the actual narrative generation process
    # For now, it's a placeholder
    pass
