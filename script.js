// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  // If an AssignmentGroup does not belong to its course (mismatching course_id),
  // your program should throw an error, letting the user know that the input was invalid.
  // Similar data validation should occur elsewhere within the program.
  try {
    if (CourseInfo.id !== AssignmentGroup.course_id) {
      throw new Error("Course IDs do not match");
    } else {
      // here, we would process this data to achieve the desired result.

      let result = [];
      // the ID of the learner for which this data has been collected
      //   "id": number,

      //create student list
      let studentList = [];
      submissions.forEach((submission) => {
        let studentExists = studentList.includes(submission.learner_id);
        if (!studentExists) {
          studentList.push(submission.learner_id);
        }
      });
      console.log(studentList);

      //fill results with students
      studentList.forEach((student) => {
        result.push({ id: student });
      });
      console.log(result);

      console.log(submissions[4]);
      //adjust submission scores for lateness
      let latePenalty = 0.1;
      submissions.forEach((submission) => {
        let i = assignmentSubmissionIndex(submission.assignment_id, ag);
        let dueAt = ag.assignments[i].due_at;
        if (submission.submission.submitted_at > dueAt) {
          submission.submission.score -=
            latePenalty * ag.assignments[i].points_possible;
          console.log(
            "late",
            latePenalty * ag.assignments[i].points_possible,
            "points taken off"
          );
          submission.submission.late = true;
        } else {
          submission.submission.late = false;
        }
      });
      console.log(submissions[4]);

      // if an assignment is not yet due, it should not be included in either
      // the average or the keyed dictionary of scores

      //get todays year-month-day
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      let todaysdate = `${year}-${month}-${day}`;
      //get id of assignments that have been due
      let dueAssignmentList = [];
      for (let i = 0; i < ag.assignments.length; i++){
        if (ag.assignments[i].due_at <= todaysdate) {
            dueAssignmentList.push(ag.assignments[i].id);
          }
      }
    //   ag.assignments.forEach((assignment) => {
    //     if (assignment.due_at <= todaysdate) {
    //       dueAssignmentList.push(assignment.id);
    //     }
    //   });
      console.log(dueAssignmentList);

      //add each submition to each student
      result.forEach((student) => {
        let totalScore = 0;
        let currentScore = 0;
        submissions.forEach((submission) => {
          //Include only assigments that have been due.
          if (dueAssignmentList.includes(submission.assignment_id)) {
            //Make sure assigments are assigned to the correct student
            if (student.id === submission.learner_id) {
              totalScore +=
                ag.assignments[
                  assignmentSubmissionIndex(submission.assignment_id, ag)
                ].points_possible;
              currentScore += submission.submission.score;
              console.log("student", student.id);
              console.log(totalScore);
              console.log(currentScore);
              student[submission.assignment_id] = submission.submission.score;
            }
          }
        });

        //Get average score
        try {
          if (totalScore === 0) {
            throw new Error("Points possible cannot be 0");
          } else {
            let averageScore = currentScore / totalScore;
            student.avg = averageScore;
          }
        } catch (error) {
          console.log(error);
        }
      });

      // the learner’s total, weighted average, in which assignments
      // with more points_possible should be counted for more
      // e.g. a learner with 50/100 on one assignment and 190/200 on another
      // would have a weighted average score of 240/300 = 80%.
      //   "avg": number,
      // each assignment should have a key with its ID,
      // and the value associated with it should be the percentage that
      // the learner scored on the assignment (submission.score / points_possible)
      //    <assignment_id>: number,

      // result = [
      //   {
      //     id: 125,
      //     avg: 0.985, // (47 + 150) / (50 + 150)
      //     1: 0.94, // 47 / 50
      //     2: 1.0 // 150 / 150
      //   },
      //   {
      //     id: 132,
      //     avg: 0.82, // (39 + 125) / (50 + 150)
      //     1: 0.78, // 39 / 50
      //     2: 0.833 // late: (140 - 15) / 150
      //   }
      // ];

      //   added inside a forEach loop of LearnerSubmissions
      //   of the following format:
      //          submissions.forEach((submission) => {
      //   to find the matching assigment in the assigment group list
      //   Returns the index of the assignment AssignmentGroup[agID];

      return result;
    }
  } catch (error) {
    console.log(error);
  }

  function assignmentSubmissionIndex(subId, ag) {
    let agId = 0;
    ag.assignments.forEach((assignment, i) => {
      if (assignment.id === subId) {
        agId = i;
      }
    });
    return agId;
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);




// *****Requirements*****

// Declare variables properly using let and const where appropriate.
// Use operators to perform calculations on variables and literals.
// Use strings, numbers, and Boolean values cached within variables.
// Use at least two if/else statements to control program flow. Optionally, use at least one switch statement.
// Use try/catch statements to manage potential errors in the code, such as incorrectly formatted or typed data being fed into your program.
// Utilize at least two different types of loops.
// Utilize at least one loop control keyword such as break or continue.
// Create and/or manipulate arrays and objects.
// Demonstrate the retrieval, manipulation, and removal of items in an array or properties in an object.
// Use functions to handle repeated tasks.
// Program outputs processed data as described above. Partial credit will be earned depending on the level of adherence to the described behavior.
// Ensure that the program runs without errors (comment out things that do not work, and explain your blockers - you can still receive partial credit).
// Commit frequently to the git repository.
// Include a README file that contains a description of your application.




// *****Remaining*****

// Use strings cached within variables.
// Use at least two if/else statements to control program flow. Optionally, use at least one switch statement.
// Use try/catch statements to manage potential errors in the code, such as incorrectly formatted or typed data being fed into your program.
// Utilize at least two different types of loops.
// Utilize at least one loop control keyword such as break or continue.
// Demonstrate the removal of items in an array or properties in an object.
// Use functions to handle repeated tasks.
// Include a README file that contains a description of your application.