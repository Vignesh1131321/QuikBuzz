
# QuikBuzz

Track: Web App Development

QuikBuzz is a buzzer platform which allows hosts to create rooms, track scores, and manage gameplay, while participants can buzz in, answer questions, and see their progress in real time. Whether it's for fun, learning, or competitive events, QuikBuzz offers a seamless and enjoyable experience for all users.



## Goal
The goal is to develop a buzzer app, which is engaging and user-friendly, for hosting and participating in the quiz competitions, with enhanced security features. 
## Features
#### 1.Room Creation and Management:
Hosts can easily create rooms with unique room pins while participants have to enter that pin, to enter the room and participate in the quiz.

Hosts can monitor team activity, including buzzes, answers, and participation and customize room settings, including the  time limits, and scoring rules.

#### 2. Fair Buzzer System and Answer Submission:

The buzzer is implemented in such a way that it records the time when a participant buzzes so that the quiz remains fair. Participants have the option either to submit the answer or not, based on the nature of the quiz round.

Real time proctoring and monitoring is implemented where hosts get alerted under the comments section, when any team switches their tabs, which further enhances the fairness.

It is also ensured that a team can submit answer only once,after buzzing.The answer of any team, which has submitted answer before starting timer or without buzzing after timer starts, will not be considered.

It is also made sure that a buzzer can be pressed only once per team in a quiz round.

#### 3. Leaderboard and Score Update:

Hosts have the option to update the score of any team.
Teams can check their performance on the leaderboard which gets updated after each scoreupdate. A bar graph is incorporated which provides further details of the team performance.




## Tech Stack

**Frontend** HTML,CSS, Plain Javascript

**Backend** Node JS, Express JS


## Further Improvements

#### 1. Making the website more responsive on all the devices.

#### 2. More options can be provided to the host to have more control over the session, like they can disqualify the team from participating in the quiz.

#### 3. A chat feature can be implemented for the participants page, so that participants belonging to the same team can chat among themselves.

#### 4. Further statistics can be provided based on the performance of the teams.

#### 5. Implementing the state of the rooms by integrating with a database.





## Challenges Faced

#### 1.Implementing fair play

It was very challenging to implement a proper buzzer system. It took long time to develop the features like tab-switching, making sure that buzzer system is proper and taking care of all edge cases.

#### 2. Nice designs of the pulsating buzzer and blinking timer.

Pulsating effect - https://youtu.be/r_RXm5NyBo0?si=txurEKTNLueA7b9n

Blinking effect - https://youtu.be/2b8ItkuUbwA?si=EEEH9PAv8tKcttXA


## Note

This is purely a website application which runs properly on laptops and desktops, because this website has to be made more responsive on mobiles.

If a host has created a room and presses createRoom button again, the current session will be removed and a new room will be created, and hence participants will have to login agian. Whereas the reset button can be used to clear the buzzes and answers so that we can move on to the next round.

The participant has to refresh the page inorder to make the buzzer normal again when moved to the new round.


## References

Icons - Flaticons

Emojis - emojihub.org

Buzzer audio - pixabay.com

Logo - logo.com