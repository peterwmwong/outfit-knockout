import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';

// TOOD(pwong): We don't may need more then just property access in the future
// const TYPE_TO_PAYLOAD = {
//   CommitCommentEvent: CommitCommentEvent,
//   CreateEvent: CreateEvent,
//   DeleteEvent: DeleteEvent,
//   FollowEvent: FollowEvent,
//   ForkEvent: ForkEvent,
//   GollumEvent: GollumEvent,
//   IssueCommentEvent: IssueCommentEvent,
//   IssuesEvent: IssuesEvent,
//   MemberEvent: MemberEvent,
//   MembershipEvent: MembershipEvent,
//   PageBuildEvent: PageBuildEvent,
//   PublicEvent: PublicEvent,
//   PullRequestEvent: PullRequestEvent,
//   PullRequestReviewCommentEvent: PullRequestReviewCommentEvent,
//   PushEvent: PushEvent,
//   ReleaseEvent: ReleaseEvent,
//   TeamAddEvent: TeamAddEvent,
//   WatchEvent: WatchEvent
// };

export default {
  localQuery:({type, id})=>{
    const local = storage.getItem(`ticker:GithubEvent:${type}/${id}`);
    return local ? JSON.parse(local) : [];
  },
  query:({type, id})=>
    loadJSON(`https://api.github.com/${type}/${id}/events`)
      .then(events=>{
        storage.setItem(`ticker:GithubEvent:${type}/${id}`, JSON.stringify(events));
        return events;
      })
};
