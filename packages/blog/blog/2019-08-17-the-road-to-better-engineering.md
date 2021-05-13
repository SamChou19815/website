# The Road to Better Engineering

## The Start

About three years ago, a student club welcomes the largest influx of new members in its entire
existence. It is considered as a milestone: it's a de facto recognition that it's becoming
prominent. By that time, its product covers over 40% of the student base and the club is the place
for future software engineers to go. The former president of the club publicly celebrated this, and
he was thinking about how the club can continue to move fast without any overhead of bureaucracy.

If you have read my [blog post](/2018/12/31/cs-in-high-schools) before, you know what had happened.
Beneath the promising sign of future prosperity, there were huge risks: the main product already hit
the upper bound of the user count; the engineering team was not well-trained by the former
president; more importantly, the codebase was in a hell state.

That club is called Computerization and that dumb former president was me.

<!--truncate-->

## The Codebase

I was still not an expert to say how the product management and engineering team training could
become better, but now I can confidently and honestly assess the state of the codebase after working
in a repository where the unit of lines of code is million.

The backend was written in PHP5 without any framework and the frontend was written in vanilla ES5
JavaScript with jQuery. It has all the problems that a modern compiler and linter would unanimously
ban. For the sake of completeness, I will list some problems and responses that should have been
given:

- Mixing HTML and backend code in PHP: strictly banned by Hack's type checker;
- Zero type declarations in top-level and class functions: strictly banned by Hack's type checker;
- Using poorly designed PHP5 features: should be spotted by good linter and make it impossible to
  pass code review;
- Poor efficiency with database access: should be spotted early in code review, if it exists;
- Poor backend security with insufficient permission check vulnerability: should be replaced with
  secure-by-default frameworks;
- Imperatively manipulating the DOM tree in the entire app without clear documentation: should be
  replaced with UI library with good state management;
- No code review: the president that allowed this to happen should be fired.

By the end of 2016, it was evident that no one was actively maintaining the codebase that should be
abandoned a year ago.

## The School and the World

While I was the president, the quality of the codebase was the last thing I cared about. Other "more
important" issues in my mind cause the idea of cleaning the codebase to be immediately garbage
collected after it's born. The thing I cared most about is how to convince more users to use our
platform so that I can put these stupid numbers on college admission forms. I also need to come up
with new ideas so that we can keep innovating, or at least make it appear that innovation is still
happening. Besides that, I have to handle all the logistics overhead to prepare for club fest, write
reflections, and try boosting member morale.

People call these stuff leadership abilities and are crazily optimizing for them. Everything seems
to prepare us to be a future leader and change the world, except that everything we do has no real
impact on the world.

Meanwhile, in the real world, a revolution in web development was happening. Kubernetes was released
in 2014, React Native and ES6 in 2015, first stable React and Angular 2 in 2016, etc. The trend of
software development has also shifted a lot: containerized application and microservices become the
industry-standard way of structuring backend; continuous integration and deployment become an
integral part of the developer workflow; statically typed programming languages were on the rise
again...

Back to school time, my development knowledge was frozen to 2014. However, the world as I knew in
2014 was forever gone. "How could I be so ignorant of the surrounding world while still claiming I
wanted to be a software engineer in the future?" I asked myself in 2017. It was a day before the
career fair. Of course, the next day did not end up well.

## Premature Optimization is Better than the Deoptimization

The following sentence is repeated countlessly in university CS lectures:

> "Premature optimization is the root of all evil."

Guided by similar principles, college admission and high school education do not focus on computer
science. Although never stated, we all know that qualities like leadership are implicitly superior
to the ability to write good code. As a result, we, the future software engineers, have to throttle
our engineering effort for something else.

Then there was the chilling effect. I started to feel guilty because I was enjoying writing my code
but I knew it was less impactful and helpful to my college admission than trying to promote our
product to teachers. Something was wrong because we were intentionally deoptimizing something that
should be optimized sooner or later.

If I all care about are those stupid numbers, I could be much happier and could achieve much greater
conventional success. But I was not. In my heart I know there exists something more important. Now I
know these things include secure applications, well-designed abstractions, and scalable
infrastructure. Random numbers are not on the list.

I don't feel pride when I am finally putting those numbers in my application, but I do feel pride
when I was writing about my work. The deep inconsistency between conventional wisdom and my personal
belief builds up emotional conflict, and it eventually bursts into an almost yelling declaration in
my college application essay: "I love math and science! I love problem-solving!" No more leadership
cliche crap, just **be the nerd**.

![Be the nerd](/img/2019-08-17-the-road-to-better-engineering/be-the-nerd.jpg)

Eventually, I won. There was an upper limit where you need to spend your time in an environment
where the evaluation system is skewed. I entered college. It is time for something new, something I
dreamed for a long time.

## A Hard Reset

It starts from my website, which is something has been set up since early 2015 but has been
neglected for a long time. After a year of learning, refactoring, and exploring, it finally reached
a state where I can be proud of. (For technical details, you can read
[this blog post](/2018/08/01/website-architecture-update).) The old code has been completely purged
and it was written in the latest Kotlin and TypeScript, running on Google Kubernetes Engine. For the
first time in a few years, the latest hot terms are like SPA, containers, and serverless are backed
by real code on my website. It did not stop there. A few days later you might see another post on my
re-architecturing effort in the past year.

No longer need to care about numbers, I could eventually start to build something technically
challenging but completely useless: my programming language. Probably with a working compiler and an
online demo by the end of 2018 summer, I secured my Facebook intern offer.

Half a year later, I became a technical product manager of my subteam. I spearheaded several large
codebase refactoring operations, including migration to Firebase, migration to TypeScript, and
adoption of continuous integration and deployment. Our product was able to launch on time, and by
the end of the semester, each commit in our codebase is automatically checked by TypeScript
compiler, ESLint, and run against a small suite of regression tests. Each merged pull request will
be automatically deployed to our staging environment. Code quality is ensured by automation and good
engineering practices are ensured by automation. Starting from next semester, I will be the dev lead
and will try to push these good practices to all subteams.

![My contribution graph](/img/2019-08-17-the-road-to-better-engineering/github-contribution.png)

It all comes after a hard reset. The reset changes the focus from fulfilling random expectations to
[challenging Turing](https://cacm.acm.org/magazines/2019/8/238344-scaling-static-analyses-at-facebook/fulltext),
pushing the limit of what we can achieve with better infrastructure.

## A Decision

From there, a question naturally arises: is this the unavoidable fate? As a proud engineer, my
answer to this question will always be no. When life gives us lemons, we don't follow the
conventional wisdom to make lemons. Instead, we build
[combustible lemons](https://www.youtube.com/watch?v=Dt6iTwVIiMM) and fire them back. At least for
the code quality problem, there are engineering solutions. With sufficient invents and care, we can
make writing good code much more pleasant and easier than writing bad ones.

Four years ago when I started the Computerization codebase, I had nothing and knew nothing about
software engineering principles. Now I had a lot: knowledge, salary, servers, experience, etc. I
believe that I can personally do something to change the course of history for the newer
generations.

This is a personal decision without any approvals, nor do I need any. I did it because I want to. I
want to do something to make the lives of high school computer suck less, to help make their
codebase better through better infrastructure and financial support, and to encourage them to move
fast and break things. Against the strong stereotype of nerds, there is the unwavering engineering
pride that we the nerd hold strong, sometimes bloodied but unbowed.

Let there be solutions to end the hell, so there comes my sponsorship.

## Engineering Problems Require Engineering Solutions

To build something to be proud of, we need to start with a good codebase. An important prerequisite
is an _independent_ engineering team. History has proved repeatedly that a mercurial boss that
generates 3 random bad ideas every day is a strong sign that code quality will start to deteriorate
at an exponential rate.

I believe that independence is not something you gain by the mercy of administrators. In other
words, you should be in the state of independence by design, not by chance. Instead of hot fixing
the issue later when independence is jeopardized, I decide to proactively protect it with my
sponsorship and automation systems. It starts with a sponsorship agreement document that is designed
to be cryptographically secure and publicly verifiable.

The document lives in a public repository and the repository sits in a repository under my GitHub
account. Branch protection is enabled for the repository in a way to enforce our revision process:
every commit to the repository must be GPG signed, and it must be a part of the already approved
pull request. I carefully designed this setup rules out several types of possible attacks against
the sponsorship:

- Everyone can fork the repository to preserve the integrity of records;
- I control the repository. No one can easily force a change on the docs content in a way that
  compromises the protection for Computerization
- The GPG signature requirement and branch protection further increase the security by introducing
  cryptographically sound means to verify the participants' identity.
- Continuous integration ensures that only people who signed can make changes that can be merged
  into master.

Even a system is secure, we cannot rely on a single line of defense. My second line of defense is a
sponsorship with enough unconditional benefits so that Computerization never needs to beg for help
elsewhere. By default, Computerization can get \$100 random activity fund and prioritized referrals,
even if they choose to do nothing for a year (although then referrals will be pretty useless). If
Computerization chooses to do something, then their server cost will be fully reimbursed, even if
their codebase is still in a total mess.

The above-mentioned terms of the sponsorship only solve one pillar of the problem: how to create a
favorable environment so that real engineering work can conformably happen. This section introduces
my response to the other pillar: how to encourage engineering efforts instead of random numbers.

People combat overfitting in machine learning by penalizing more complex models, trading training
accuracy for validation accuracy. In other words, people favor generality over specificity. I
believe making the sponsorship dependent on some specific project plan is an action that invites
overfitting. After all, it just makes myself another random boss and introduces some metrics for bad
actors to overfit with 1000-layer deep neural network at the cost of a polluted codebase.

Hence, I make the rest of the sponsorship _project-blind_ and _number-blind_. Instead, it provides
rewards only for better engineering efforts. Enforcing industry-standard best practices like
continuous integration will lead to personal project reimbursement of top contributors, but
increases the platform usage by 5% is a no-op to the sponsorship. As a result, optimizing for
numbers gives you only numbers, but optimizing for better engineering can enable you to do more
great things.

The current setup might make you believe that I'm intentionally guiding Computerization to
implementing something completely useless. For example, writing a good compiler will lead to the
greatest reward under the sponsorship terms. While the compiler case is true, it is not my
intention. This setup will probably slow things down by a month, but engineers will waste more time
if they create a codebase in hell that everyone hates and no one can fix. In the end, it is the
stable infrastructure that ensures engineers to move fast, not unconstrained passions for numbers.

## Back to the Future

By the time this blog post is published, the sponsorship agreement has been signed and in effect.

On the development side, my experimental GitHub query project that is designed to support this
sponsorship has been fully deployed, my programming language can be compiled to
TypeScript/JavaScript, and my repositories are moving to adopt the latest GitHub Actions features.

![New GitHub Actions Workflow](/img/2019-08-17-the-road-to-better-engineering/github-actions.png)

The road to better engineering does not end here. We the computer scientists still don't know the
best approach to beat Turing-complete problems with scalable static analysis, but we all know the
next small step: stop talking, start to write better code, and **ship it**.
