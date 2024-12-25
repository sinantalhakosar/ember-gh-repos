import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  PHP: '#4F5D95',
};

export default helper(function languageColor([language]) {
  return htmlSafe(
    `background-color: ${LANGUAGE_COLORS[language] || '#cccccc'}`,
  );
});
