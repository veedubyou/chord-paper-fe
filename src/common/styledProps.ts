// extend your props with this and thread the className through to support MUI 5 styled() API
// e.g. to support
// const BlueYourComponent = styled(YourComponent)({
//      color: "blue"   
// });

// interface YourComponentProps extends MUIStyledProps { ... }
// const YourComponent = (props: YourComponentProps) => {
//      return <Box className={props.className}> ... </Box> 
// }
export interface MUIStyledProps {
    className?: string;
}