import classNames from 'classnames';

function Bullets({ levelList }) {
  // Безопасная проверка элементов levelList и установка значения по умолчанию для undefined
  const safeLevelList = levelList.map((value) => value !== undefined ? value : false);

  return (
    <div className="bullets">
      <div
        className={classNames(
          'dot',
          { 'active-dot': safeLevelList[0] }
        )}
      ></div>
      <div
        className={classNames(
          'dot',
          { 'active-dot': safeLevelList[1] }
        )}
      ></div>
      <div
        className={classNames(
          'dot',
          { 'active-dot': safeLevelList[2] }
        )}
      ></div>
    </div>
  );
}

Bullets.defaultProps = {
  levelList: [false, false, false],
};

export default Bullets;
