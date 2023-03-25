import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";

const Recommendations = () => {
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);

    return (
        <div className="text-left pt-2">
            
            <h5>Recomendações
            { 
                hoveredFeature ? 
                (!hoveredFeature.markerName ? ` ${hoveredFeature.properties.Concelho}` : ` ${hoveredFeature.markerName} (${hoveredFeature?.properties.Concelho})`) :
                null
            }
            </h5>
            {
                !hoveredFeature ? <span>Sem localidade selecionada</span>
                :
                <span>
                Noite épica para o Sporting, que foi melhor nos 120 minutos, mas precisou do desempate por pontapés de 
                grande penalidade para fazer cair o Arsenal, um dos mais forte candidatos a vencer a Liga Europa. 
                Nuno Santos fez o remate decisivo, mas Adán foi gigante e Pedro Gonçalves marcou um golo que foi obra de arte.

                O Sporting entrou bem, a jogar de olhos nos olhos com o Arsenal, e Trincão até rematou com algum perigo. 
                Mas aos poucos o Arsenal foi tomando conta do jogo e obrigando os leões a recuarem.

                Até que aos 19 minutos Martinelli remata forte para excelente defesa de Adán, mas na recarga Xhaka coloca 
                a bola no fundo da baliza portuguesa. Estava o Arsenal em vantagem no jogo e na eliminatória.
                </span>
            }
            
        </div>
    );
}

export default Recommendations;