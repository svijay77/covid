import styled from "styled-components";
import colors from "../config/colors";

export default styled.p`
    position: absolute;
    top:45%;
    right:${props =>  'right' in props ? props.right+'px' : 'initial'};
    left:${props => 'left' in props ? props.left+'px' : 'initial'};
    transform: translateY(-50%) rotate(90deg);
    font-weight: bold;
    font-size:1rem;
    color: ${props => props.color||'white'};
`