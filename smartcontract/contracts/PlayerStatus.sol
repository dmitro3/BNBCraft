// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract PlayerStatus{
    mapping(string => bool) private tasks;
    string[] private taskNames;

    // constructor takes array of strings and sets them as tasks intially false
    constructor(string[] memory _tasks) {
        for(uint i = 0; i < _tasks.length; i++){
            tasks[_tasks[i]] = false;
            taskNames.push(_tasks[i]);
        }
    }

    // function to mark the task as completed
    function completeTask(string memory _task) public {
        //[TODO] check if the task exists
        tasks[_task] = true;
    }

    // function to check if the task is completed
    function isTaskCompleted(string memory _task) public view returns(bool){
        // [TODO] check if the task exists
        return tasks[_task];
    }

    // function reset the tasks
    function reset() public {
        for(uint i = 0; i < taskNames.length; i++){
            tasks[taskNames[i]] = false;
        }
    }

    // function to get status of all tasks
    // [TODO] This function is not working as expected. Fix it
    // function getStatus() public view returns(mapping(string => bool) memory){
    //     return tasks;
    // }
}
