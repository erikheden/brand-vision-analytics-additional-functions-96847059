
interface EmptyChartStateProps {
  selectedCountry: string;
}

const EmptyChartState = ({ selectedCountry }: EmptyChartStateProps) => {
  return (
    <div 
      className="h-[500px] flex items-center justify-center text-[#34502b]" 
      style={{ fontFamily: 'Forma DJR Display' }}
    >
      {selectedCountry
        ? "Select brands to view their rankings"
        : "Select a country to get started"}
    </div>
  );
};

export default EmptyChartState;
