import styled from 'styled-components';
import { Grid } from '@material-ui/core';
    
const TeamBio = styled(Grid)`
    display:flex;
    img {
        max-width:10em;
        padding-bottom:2em;
    }
    span {
        padding-left:1em;
    }
`

const CoreMemberBio = ({member, columns}) => 
    <TeamBio item xs={12} {...columns}>
        <img src={`${process.env.PUBLIC_URL}/img/people/${member.img}`} alt={`${member.name}`}/>
        <span>
            <h4>{member.name}</h4>
            <h5>{member.title}</h5>
        </span>
    </TeamBio>

export default function MemberGrid({members, columns}){
    return <Grid container spacing={2}>
        {members.map(member => <CoreMemberBio member={member} columns={columns} />)}
    </Grid>
}