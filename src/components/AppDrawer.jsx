import './AppDrawer.css';
import './common/List.css';
import xvdom      from 'xvdom';
import Icon from './common/Icon.jsx';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import compare    from '../helpers/compare';

const sortRepos = (a, b)=> compare(a.full_name, b.full_name);
const sortUsers = (a, b)=> compare(a.login,     b.login);

const SourceGroup = ({sourceNameProp, sources, sort, type})=>
  <div>
    {sources
      .filter((s)=> s.type === type)
      .sort(sort)
      .map(({avatar_url, [sourceNameProp]:name})=>
        <div className='layout horizontal center l-padding-l4' key={name}>
          <Avatar avatarUrl={avatar_url} />
          <SourceName
            className='List-item List-item--noBorder'
            displayName={name}
            key={name}
          />
        </div>
      )
    }
  </div>

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
let lazyRenderContents = false;
export default ({user, enabled, onLogin})=> {
  lazyRenderContents  = enabled || lazyRenderContents;
  const enabledClass  = enabled            ? 'is-enabled'  : '';
  const renderedClass = lazyRenderContents ? 'is-rendered' : '';
  return (
    <div className={`AppDrawer fixed scroll ${enabledClass} ${renderedClass}`}>
      {lazyRenderContents && (
        user ? (
          <div>
            <div className='List-item List-item--noBorder layout horizontal center'>
              <Avatar avatarUrl={`https://avatars.githubusercontent.com/u/${user.id}?`} />
              <span className='l-margin-l4' textContent={user.githubUsername} />
            </div>
            <div className='List-item List-item--header c-gray-dark t-normal t-uppercase'>
              Repositories
            </div>
            <SourceGroup
              sort={sortRepos}
              sourceNameProp='full_name'
              sources={user.sources}
              type='GithubRepoSource'
            />
            <div className='List-item List-item--header c-gray-dark t-normal t-uppercase'>
              Users / Orgs
            </div>
            <SourceGroup
              sort={sortUsers}
              sourceNameProp='login'
              sources={user.sources}
              type='GithubUserSource'
            />
          </div>
        ) : (
          <div
            className='List-item List-item--noBorder layout horizontal center'
            onclick={onLogin}
          >
            <Icon name='mark-github' />
            <span className='l-margin-l4' textContent='Login with GitHub' />
          </div>
        )
      )}
    </div>
  )
};
