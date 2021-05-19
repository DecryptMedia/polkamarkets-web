import Alert from '../Alert';

function LiquidityFormInfo() {
  return (
    <div className="pm-c-liquidity-form__info">
      <Alert
        variant="warning"
        description="When adding liquidity on an unbalanced market, you’ll get part of your stake as outcome shares."
      />
    </div>
  );
}

LiquidityFormInfo.displayName = 'LiquidityFormInfo';

export default LiquidityFormInfo;
